"""
=============================================================================
BLOG WEBSITE - Complete Python Flask REST Backend & Server
RGUKT RK VALLEY - Department of Computer Science
Course: Software Engineering / Web Technologies (E-3 Sem-1)
Student: P Jaswanth (Roll No. R220601)
Faculty Guide: Lingamurthy Sir
Technologies: Python Flask, PyMySQL, SQLite3, Bootstrap 5, HTML5, CSS3, JS
=============================================================================
"""

import os
import uuid
from datetime import datetime
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import db

# Initialize Flask Application
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__, static_folder='.', static_url_path='')
app.config['SECRET_KEY'] = 'rgukt-rkv-blog-website-secret-key-2026'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max image upload

CORS(app)

# Initialize Database (attempts MySQL on XAMPP 3306 first; falls back to SQLite)
print("=" * 70)
print("BLOG WEBSITE BACKEND - RGUKT RK VALLEY")
print("Initializing database connection...")
ACTIVE_ENGINE = db.init_database()
print(f"Active Database Engine: {ACTIVE_ENGINE}")
print("=" * 70)


# =============================================================================
# HELPER DATABASE FUNCTIONS (Uniform row dictionaries across MySQL & SQLite)
# =============================================================================
def query_db(query, args=(), one=False):
    """Executes a SELECT query and returns dictionaries."""
    conn, engine = db.get_db()
    if engine == 'MySQL':
        with conn.cursor() as cur:
            cur.execute(query, args)
            rv = cur.fetchall()
        conn.close()
        return (rv[0] if rv else None) if one else rv
    else:
        # SQLite uses '?' placeholder instead of '%s'
        sqlite_query = query.replace('%s', '?')
        cur = conn.cursor()
        cur.execute(sqlite_query, args)
        rv = cur.fetchall()
        conn.close()
        # Convert sqlite3.Row to standard dict
        dict_rows = [dict(row) for row in rv]
        return (dict_rows[0] if dict_rows else None) if one else dict_rows


def execute_db(query, args=()):
    """Executes an INSERT, UPDATE, or DELETE query and returns lastrowid and rowcount."""
    conn, engine = db.get_db()
    if engine == 'MySQL':
        with conn.cursor() as cur:
            cur.execute(query, args)
            last_id = cur.lastrowid
            affected = cur.rowcount
        conn.commit()
        conn.close()
        return last_id, affected
    else:
        sqlite_query = query.replace('%s', '?')
        cur = conn.cursor()
        cur.execute(sqlite_query, args)
        conn.commit()
        last_id = cur.lastrowid
        affected = cur.rowcount
        conn.close()
        return last_id, affected


# =============================================================================
# FRONTEND STATIC ASSET ROUTES
# =============================================================================
@app.route('/')
def serve_index():
    """Serves the main frontend Single Page Application (index.html)"""
    return send_from_directory('.', 'index.html')

@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('css', filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename)

@app.route('/uploads/<path:filename>')
def serve_uploads(filename):
    """Serves uploaded user images (UC-09)"""
    return send_from_directory(UPLOAD_FOLDER, filename)


# =============================================================================
# 1. SYSTEM STATUS & TELEMETRY API
# =============================================================================
@app.route('/api/status', methods=['GET'])
def api_status():
    """Health check, database status, and academic metadata endpoint"""
    status_data = db.get_db_status()
    return jsonify({
        "status": "online",
        "project": "BLOG WEBSITE",
        "academic": {
            "institution": "Rajiv Gandhi University of Knowledge Technologies (RGUKT RK Valley)",
            "department": "Department of Computer Science",
            "semester": "E-3 Sem-1",
            "student_name": "P Jaswanth",
            "roll_no": "R220601",
            "email": "r220601@rguktrkv.ac.in",
            "faculty_guide": "Lingamurthy Sir"
        },
        "database": status_data,
        "srs_use_cases": [
            "UC-01: Register Account", "UC-02: Log In", "UC-03: Manage Profile",
            "UC-04: Create Blog Post", "UC-05: Edit Blog Post", "UC-06: Delete Blog Post",
            "UC-07: View Blog Post", "UC-08: Search and Browse Posts", "UC-09: Add Image to Post",
            "UC-10: Post a Comment", "UC-11: Like a Post", "UC-12: Administrator Management"
        ]
    })


# =============================================================================
# 2. CATEGORIES API
# =============================================================================
@app.route('/api/categories', methods=['GET'])
def api_get_categories():
    """Retrieves all blog post categories (SRS Section 9)"""
    cats = query_db("SELECT category_id AS id, name FROM categories ORDER BY category_id ASC;")
    return jsonify([c['name'] for c in cats])


# =============================================================================
# 3. BLOG POSTS API (UC-04, UC-05, UC-06, UC-07, UC-08)
# =============================================================================
@app.route('/api/posts', methods=['GET'])
def api_get_posts():
    """
    Lists blog posts with optional filtering:
      - ?category=Web+Development
      - ?search=python
      - ?author_id=1
    """
    category_filter = request.args.get('category', '').strip()
    search_query = request.args.get('search', '').strip()
    author_filter = request.args.get('author_id', '').strip()

    sql = """
        SELECT 
            p.post_id AS id,
            p.title,
            p.content,
            p.date,
            p.image_url AS image,
            p.likes_count AS likes,
            p.author_id AS authorId,
            u.name AS authorName,
            c.name AS category,
            (SELECT COUNT(*) FROM comments cm WHERE cm.post_id = p.post_id) AS commentCount
        FROM posts p
        JOIN users u ON p.author_id = u.user_id
        JOIN categories c ON p.category_id = c.category_id
        WHERE 1=1
    """
    params = []

    if category_filter and category_filter.lower() != 'all':
        sql += " AND LOWER(c.name) = LOWER(%s)"
        params.append(category_filter)

    if author_filter:
        sql += " AND p.author_id = %s"
        params.append(author_filter)

    if search_query:
        sql += " AND (LOWER(p.title) LIKE %s OR LOWER(p.content) LIKE %s OR LOWER(u.name) LIKE %s OR LOWER(c.name) LIKE %s)"
        like_arg = f"%{search_query.lower()}%"
        params.extend([like_arg, like_arg, like_arg, like_arg])

    sql += " ORDER BY p.post_id DESC;"

    posts = query_db(sql, tuple(params))

    # Fetch likedBy user IDs for each post
    all_likes = query_db("SELECT post_id, user_id FROM post_likes;")
    likes_map = {}
    for l in all_likes:
        likes_map.setdefault(l['post_id'], []).append(l['user_id'])

    for p in posts:
        p['likedBy'] = likes_map.get(p['id'], [])
        # Ensure date string is cleanly formatted
        if isinstance(p['date'], (datetime,)):
            p['date'] = p['date'].strftime('%Y-%m-%d')
        elif p['date']:
            p['date'] = str(p['date'])
        # Normalize local image path so it is relative without leading slash
        if p.get('image') and isinstance(p['image'], str) and p['image'].startswith('/uploads/'):
            p['image'] = p['image'][1:]

    return jsonify(posts)


@app.route('/api/posts/<int:post_id>', methods=['GET'])
def api_get_post_detail(post_id):
    """UC-07: Retrieves full details of a single blog post along with its comments"""
    post = query_db("""
        SELECT 
            p.post_id AS id,
            p.title,
            p.content,
            p.date,
            p.image_url AS image,
            p.likes_count AS likes,
            p.author_id AS authorId,
            u.name AS authorName,
            c.name AS category
        FROM posts p
        JOIN users u ON p.author_id = u.user_id
        JOIN categories c ON p.category_id = c.category_id
        WHERE p.post_id = %s;
    """, (post_id,), one=True)

    if not post:
        return jsonify({"error": "Post not found"}), 404

    if isinstance(post['date'], datetime):
        post['date'] = post['date'].strftime('%Y-%m-%d')
    else:
        post['date'] = str(post['date'])

    if post.get('image') and isinstance(post['image'], str) and post['image'].startswith('/uploads/'):
        post['image'] = post['image'][1:]

    # Get likes
    likes_rows = query_db("SELECT user_id FROM post_likes WHERE post_id = %s;", (post_id,))
    post['likedBy'] = [r['user_id'] for r in likes_rows]

    # Get comments
    comments = query_db("""
        SELECT 
            cm.comment_id AS id,
            cm.post_id AS postId,
            cm.user_id AS userId,
            u.name AS userName,
            cm.content,
            cm.date
        FROM comments cm
        JOIN users u ON cm.user_id = u.user_id
        WHERE cm.post_id = %s
        ORDER BY cm.comment_id ASC;
    """, (post_id,))
    post['comments'] = comments

    return jsonify(post)


@app.route('/api/posts', methods=['POST'])
def api_create_post():
    """UC-04: Creates a new blog post"""
    data = request.get_json() or {}
    title = data.get('title', '').strip()
    content = data.get('content', '').strip()
    category_name = data.get('category', '').strip()
    author_id = data.get('authorId')
    image_url = data.get('image', '').strip() or 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'

    if not title or not content:
        return jsonify({"error": "Title and content cannot be empty (SRS UC-04)"}), 400

    if not author_id:
        return jsonify({"error": "Author must be logged in to create a post"}), 401

    # Resolve or create category
    cat_row = query_db("SELECT category_id FROM categories WHERE LOWER(name) = LOWER(%s);", (category_name,), one=True)
    if not cat_row:
        cat_id, _ = execute_db("INSERT INTO categories (name) VALUES (%s);", (category_name,))
    else:
        cat_id = cat_row['category_id']

    today_str = datetime.now().strftime('%Y-%m-%d')
    if image_url and isinstance(image_url, str) and image_url.startswith('/uploads/'):
        image_url = image_url[1:]
    new_id, _ = execute_db("""
        INSERT INTO posts (title, content, author_id, category_id, date, image_url, likes_count)
        VALUES (%s, %s, %s, %s, %s, %s, 0);
    """, (title, content, author_id, cat_id, today_str, image_url))

    # Also log into images table if an image is provided
    if image_url:
        execute_db("""
            INSERT INTO images (post_id, file_path, file_type)
            VALUES (%s, %s, 'image/jpeg');
        """, (new_id, image_url))

    return jsonify({"success": True, "postId": new_id, "message": "Blog post created successfully"}), 201


@app.route('/api/posts/<int:post_id>', methods=['PUT'])
def api_edit_post(post_id):
    """UC-05: Edits an existing blog post (Author or Admin)"""
    data = request.get_json() or {}
    title = data.get('title', '').strip()
    content = data.get('content', '').strip()
    category_name = data.get('category', '').strip()
    user_id = data.get('userId')
    image_url = data.get('image')

    post = query_db("SELECT * FROM posts WHERE post_id = %s;", (post_id,), one=True)
    if not post:
        return jsonify({"error": "Post not found"}), 404

    # Permission check: Author or Admin
    requesting_user = query_db("SELECT role FROM users WHERE user_id = %s;", (user_id,), one=True)
    if not requesting_user:
        return jsonify({"error": "Unauthorized"}), 403

    if post['author_id'] != user_id and requesting_user['role'] != 'admin':
        return jsonify({"error": "Cannot edit another user's post (SRS UC-05)"}), 403

    # Category update
    cat_row = query_db("SELECT category_id FROM categories WHERE LOWER(name) = LOWER(%s);", (category_name,), one=True)
    cat_id = cat_row['category_id'] if cat_row else post['category_id']

    new_image = image_url if image_url is not None else post['image_url']
    if new_image and isinstance(new_image, str) and new_image.startswith('/uploads/'):
        new_image = new_image[1:]

    execute_db("""
        UPDATE posts
        SET title = %s, content = %s, category_id = %s, image_url = %s
        WHERE post_id = %s;
    """, (title or post['title'], content or post['content'], cat_id, new_image, post_id))

    return jsonify({"success": True, "message": "Post updated successfully"})


@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def api_delete_post(post_id):
    """UC-06: Deletes a blog post (Author or Admin)"""
    user_id = request.args.get('userId', type=int)

    post = query_db("SELECT * FROM posts WHERE post_id = %s;", (post_id,), one=True)
    if not post:
        return jsonify({"error": "Post not found"}), 404

    requesting_user = query_db("SELECT role FROM users WHERE user_id = %s;", (user_id,), one=True)
    if not requesting_user:
        return jsonify({"error": "Unauthorized"}), 403

    if post['author_id'] != user_id and requesting_user['role'] != 'admin':
        return jsonify({"error": "Permission denied to delete post (SRS UC-06)"}), 403

    execute_db("DELETE FROM posts WHERE post_id = %s;", (post_id,))
    return jsonify({"success": True, "message": "Post removed successfully"})


# =============================================================================
# 4. LIKES API (UC-11)
# =============================================================================
@app.route('/api/posts/<int:post_id>/like', methods=['POST'])
def api_toggle_like(post_id):
    """UC-11: Toggles like on a blog post for a logged-in user"""
    data = request.get_json() or {}
    user_id = data.get('userId')
    if not user_id:
        return jsonify({"error": "Login required to like posts"}), 401

    existing_like = query_db("""
        SELECT * FROM post_likes WHERE post_id = %s AND user_id = %s;
    """, (post_id, user_id), one=True)

    if existing_like:
        # Unlike
        execute_db("DELETE FROM post_likes WHERE post_id = %s AND user_id = %s;", (post_id, user_id))
        execute_db("UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE post_id = %s;", (post_id,))
        liked = False
    else:
        # Like
        execute_db("INSERT INTO post_likes (post_id, user_id) VALUES (%s, %s);", (post_id, user_id))
        execute_db("UPDATE posts SET likes_count = likes_count + 1 WHERE post_id = %s;", (post_id,))
        liked = True

    updated_post = query_db("SELECT likes_count FROM posts WHERE post_id = %s;", (post_id,), one=True)
    new_count = updated_post['likes_count'] if updated_post else 0

    return jsonify({"success": True, "liked": liked, "likes": new_count})


# =============================================================================
# 5. COMMENTS API (UC-10)
# =============================================================================
@app.route('/api/posts/<int:post_id>/comments', methods=['GET'])
def api_get_comments(post_id):
    """Retrieves all comments for a blog post"""
    comments = query_db("""
        SELECT 
            cm.comment_id AS id,
            cm.post_id AS postId,
            cm.user_id AS userId,
            u.name AS userName,
            cm.content,
            cm.date
        FROM comments cm
        JOIN users u ON cm.user_id = u.user_id
        WHERE cm.post_id = %s
        ORDER BY cm.comment_id ASC;
    """, (post_id,))
    return jsonify(comments)


@app.route('/api/posts/<int:post_id>/comments', methods=['POST'])
def api_post_comment(post_id):
    """UC-10: Submits a new comment on a post"""
    data = request.get_json() or {}
    user_id = data.get('userId')
    content = data.get('content', '').strip()

    if not user_id:
        return jsonify({"error": "Please log in to submit a comment (SRS UC-10)"}), 401
    if not content:
        return jsonify({"error": "Empty comments are not accepted (SRS UC-10)"}), 400

    now_str = datetime.now().strftime('%Y-%m-%d %H:%M')
    comment_id, _ = execute_db("""
        INSERT INTO comments (post_id, user_id, content, date)
        VALUES (%s, %s, %s, %s);
    """, (post_id, user_id, content, now_str))

    user = query_db("SELECT name FROM users WHERE user_id = %s;", (user_id,), one=True)
    user_name = user['name'] if user else 'Anonymous'

    return jsonify({
        "success": True,
        "comment": {
            "id": comment_id,
            "postId": post_id,
            "userId": user_id,
            "userName": user_name,
            "content": content,
            "date": now_str
        }
    }), 201


@app.route('/api/comments/<int:comment_id>', methods=['DELETE'])
def api_delete_comment(comment_id):
    """UC-12: Deletes a comment (Comment author or Admin)"""
    user_id = request.args.get('userId', type=int)

    comment = query_db("SELECT * FROM comments WHERE comment_id = %s;", (comment_id,), one=True)
    if not comment:
        return jsonify({"error": "Comment not found"}), 404

    requesting_user = query_db("SELECT role FROM users WHERE user_id = %s;", (user_id,), one=True)
    if not requesting_user:
        return jsonify({"error": "Unauthorized"}), 403

    if comment['user_id'] != user_id and requesting_user['role'] != 'admin':
        return jsonify({"error": "Permission denied"}), 403

    execute_db("DELETE FROM comments WHERE comment_id = %s;", (comment_id,))
    return jsonify({"success": True, "message": "Comment deleted"})


# =============================================================================
# 6. AUTHENTICATION & PROFILE API (UC-01, UC-02, UC-03)
# =============================================================================
@app.route('/api/auth/register', methods=['POST'])
def api_register():
    """UC-01: Registers a new user account with hashed password"""
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    role = data.get('role', 'author')
    if role == 'admin':
        role = 'author'  # Security: Administrator accounts cannot be self-registered

    if not name or not email or not password:
        return jsonify({"error": "All fields are required (SRS UC-01)"}), 400

    existing = query_db("SELECT user_id FROM users WHERE LOWER(email) = %s;", (email,), one=True)
    if existing:
        return jsonify({"error": "Email address is already registered (SRS UC-01)"}), 400

    hashed_pw = generate_password_hash(password)
    user_id, _ = execute_db("""
        INSERT INTO users (name, email, password, role, bio)
        VALUES (%s, %s, %s, %s, 'Student at RGUKT RK Valley.');
    """, (name, email, hashed_pw, role))

    return jsonify({
        "success": True,
        "user": {
            "id": user_id,
            "name": name,
            "email": email,
            "role": role,
            "bio": 'Student at RGUKT RK Valley.'
        }
    }), 201


@app.route('/api/auth/login', methods=['POST'])
def api_login():
    """UC-02: Validates login credentials and returns user session object"""
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"error": "Email and password required (SRS UC-02)"}), 400

    user = query_db("""
        SELECT user_id AS id, name, email, password, role, bio
        FROM users
        WHERE LOWER(email) = %s;
    """, (email,), one=True)

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    # Check hashed password or plain text fallback (for demo seeds)
    stored_hash = user['password']
    valid = False
    try:
        valid = check_password_hash(stored_hash, password)
    except Exception:
        valid = (stored_hash == password)

    if not valid and stored_hash == password:
        valid = True

    if not valid:
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "success": True,
        "user": {
            "id": user['id'],
            "name": user['name'],
            "email": user['email'],
            "role": user['role'],
            "bio": user['bio'] or ''
        }
    })


@app.route('/api/auth/profile/<int:user_id>', methods=['GET'])
def api_get_profile(user_id):
    """UC-03: Retrieves user profile details, dashboard statistics, authored posts and comments"""
    user = query_db("""
        SELECT user_id AS id, name, email, role, bio, created_at AS joined
        FROM users WHERE user_id = %s;
    """, (user_id,), one=True)

    if not user:
        return jsonify({"error": "User not found"}), 404

    authored_posts = query_db("""
        SELECT 
            p.post_id AS id,
            p.title,
            p.content,
            p.date,
            p.image_url AS image,
            p.likes_count AS likes,
            c.name AS category
        FROM posts p
        JOIN categories c ON p.category_id = c.category_id
        WHERE p.author_id = %s
        ORDER BY p.post_id DESC;
    """, (user_id,))

    # Dashboard Metrics
    total_posts = len(authored_posts)
    total_likes = sum((p.get('likes') or 0) for p in authored_posts)
    post_ids = [p['id'] for p in authored_posts]

    comments_received = []
    total_comments = 0
    if post_ids:
        placeholders = ','.join(['%s'] * len(post_ids))
        comments_received = query_db(f"""
            SELECT c.comment_id AS id, c.post_id, c.content, c.date, u.name AS user_name, p.title AS post_title
            FROM comments c
            JOIN users u ON c.user_id = u.user_id
            JOIN posts p ON c.post_id = p.post_id
            WHERE c.post_id IN ({placeholders})
            ORDER BY c.comment_id DESC
            LIMIT 10;
        """, tuple(post_ids))

        count_res = query_db(f"""
            SELECT COUNT(*) AS c FROM comments WHERE post_id IN ({placeholders});
        """, tuple(post_ids), one=True)
        total_comments = count_res['c'] if count_res else 0

    user['posts'] = authored_posts
    user['stats'] = {
        'totalPosts': total_posts,
        'totalLikes': total_likes,
        'totalComments': total_comments,
        'avgLikes': round(total_likes / total_posts, 1) if total_posts > 0 else 0
    }
    user['comments_received'] = comments_received
    return jsonify(user)


@app.route('/api/auth/profile/<int:user_id>', methods=['PUT'])
def api_update_profile(user_id):
    """UC-03: Updates user profile details"""
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    bio = data.get('bio', '').strip()
    new_password = data.get('password', '').strip()

    user = query_db("SELECT * FROM users WHERE user_id = %s;", (user_id,), one=True)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if new_password:
        hashed_pw = generate_password_hash(new_password)
        execute_db("""
            UPDATE users SET name = %s, email = %s, bio = %s, password = %s
            WHERE user_id = %s;
        """, (name or user['name'], email or user['email'], bio, hashed_pw, user_id))
    else:
        execute_db("""
            UPDATE users SET name = %s, email = %s, bio = %s
            WHERE user_id = %s;
        """, (name or user['name'], email or user['email'], bio, user_id))

    return jsonify({
        "success": True,
        "user": {
            "id": user_id,
            "name": name or user['name'],
            "email": email or user['email'],
            "bio": bio,
            "role": user['role']
        }
    })


# =============================================================================
# 7. IMAGE UPLOAD API (UC-09)
# =============================================================================
@app.route('/api/upload', methods=['POST'])
def api_upload_image():
    """UC-09: Handles image file upload, saves to disk, and returns URL"""
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided in request"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    allowed_exts = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_exts:
        return jsonify({"error": f"Unsupported file type '{ext}'. Allowed: JPG, PNG, WEBP"}), 400

    filename = f"upload_{uuid.uuid4().hex[:12]}{ext}"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    return jsonify({
        "success": True,
        "imageUrl": f"uploads/{filename}",
        "filename": filename
    })


# =============================================================================
# 8. ADMINISTRATOR MANAGEMENT API (UC-12)
# =============================================================================
@app.route('/api/admin/stats', methods=['GET'])
def api_admin_stats():
    """UC-12: Statistics overview for admin dashboard"""
    u_count = query_db("SELECT COUNT(*) AS c FROM users;", one=True)['c']
    p_count = query_db("SELECT COUNT(*) AS c FROM posts;", one=True)['c']
    c_count = query_db("SELECT COUNT(*) AS c FROM comments;", one=True)['c']
    l_count = query_db("SELECT COUNT(*) AS c FROM post_likes;", one=True)['c']

    return jsonify({
        "totalUsers": u_count,
        "totalPosts": p_count,
        "totalComments": c_count,
        "totalLikes": l_count
    })


@app.route('/api/admin/users', methods=['GET'])
def api_admin_get_users():
    """UC-12: List all registered users for administration"""
    users = query_db("""
        SELECT 
            u.user_id AS id,
            u.name,
            u.email,
            u.role,
            u.bio,
            (SELECT COUNT(*) FROM posts p WHERE p.author_id = u.user_id) AS postCount,
            (SELECT COUNT(*) FROM comments c WHERE c.user_id = u.user_id) AS commentCount
        FROM users u
        ORDER BY u.user_id ASC;
    """)
    return jsonify(users)


@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
def api_admin_delete_user(user_id):
    """UC-12: Removes a user account (Admin only)"""
    admin_id = request.args.get('adminId', type=int)
    admin = query_db("SELECT role FROM users WHERE user_id = %s;", (admin_id,), one=True)
    if not admin or admin['role'] != 'admin':
        return jsonify({"error": "Admin privileges required (SRS UC-12)"}), 403

    if user_id == admin_id:
        return jsonify({"error": "Cannot delete active administrator account"}), 400

    execute_db("DELETE FROM users WHERE user_id = %s;", (user_id,))
    return jsonify({"success": True, "message": "User deleted successfully"})


@app.route('/api/admin/comments', methods=['GET'])
def api_admin_get_comments():
    """UC-12: List all comments for moderation"""
    comments = query_db("""
        SELECT 
            cm.comment_id AS id,
            cm.post_id AS postId,
            p.title AS postTitle,
            cm.user_id AS userId,
            u.name AS userName,
            cm.content,
            cm.date
        FROM comments cm
        JOIN users u ON cm.user_id = u.user_id
        JOIN posts p ON cm.post_id = p.post_id
        ORDER BY cm.comment_id DESC;
    """)
    return jsonify(comments)


# =============================================================================
# SERVER ENTRYPOINT
# =============================================================================
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("=" * 70)
    print(">> RGUKT RK VALLEY - BLOG WEBSITE APPLICATION")
    print(">> Author: P Jaswanth (Roll No. R220601)")
    print(">> Faculty Guide: Lingamurthy Sir")
    print(f">> Active Database: {ACTIVE_ENGINE}")
    print(f">> Server URL: http://127.0.0.1:{port}")
    print("=" * 70)
    app.run(host='127.0.0.1', port=port, debug=True)
