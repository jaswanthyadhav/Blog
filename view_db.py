"""
=============================================================================
BLOG WEBSITE - Database Viewer Script
RGUKT RK Valley - P Jaswanth (R220601)
Usage:
    python view_db.py
=============================================================================
"""
import sys
from db import get_db, get_db_status

def print_separator(title=""):
    width = 80
    if title:
        print(f"\n===== {title.upper()} {'=' * max(0, width - len(title) - 8)}")
    else:
        print("=" * width)

def query(sql, params=()):
    conn, engine = get_db()
    try:
        if engine == 'MySQL':
            with conn.cursor() as cur:
                cur.execute(sql, params)
                return cur.fetchall()
        else:
            cur = conn.cursor()
            cur.execute(sql, params)
            rows = cur.fetchall()
            # Convert sqlite3.Row to dict
            return [dict(r) for r in rows]
    finally:
        conn.close()

def display_database():
    status = get_db_status()
    print_separator("DATABASE CONNECTION STATUS")
    print(f"Engine   : {status['engine']}")
    print(f"Database : {status.get('database')}")
    print(f"Host     : {status.get('host')}")
    print(f"Connected: {status.get('connected')}")
    print(f"Summary  : Users: {status['counts']['users']} | Posts: {status['counts']['posts']} | Categories: {status['counts']['categories']} | Comments: {status['counts']['comments']} | Likes: {status['counts']['likes']}")

    # 1. Categories
    print_separator("CATEGORIES (SRS Section 9)")
    cats = query("SELECT category_id, name FROM categories ORDER BY category_id")
    if cats:
        print(f"{'ID':<4} | {'Name':<25}")
        print("-" * 40)
        for c in cats:
            print(f"{c['category_id']:<4} | {c['name']:<25}")

    # 2. Users
    print_separator("USERS (UC-01, UC-02)")
    users = query("SELECT user_id, name, email, role, bio FROM users ORDER BY user_id")
    if users:
        print(f"{'ID':<4} | {'Name':<20} | {'Email':<28} | {'Role':<8} | {'Bio'}")
        print("-" * 80)
        for u in users:
            bio_snippet = (u.get('bio') or '')[:35]
            print(f"{u['user_id']:<4} | {u['name']:<20} | {u['email']:<28} | {u['role']:<8} | {bio_snippet}")

    # 3. Blog Posts
    print_separator("BLOG POSTS (UC-04 to UC-08)")
    posts = query("""
        SELECT p.post_id, p.title, c.name AS category, u.name AS author, p.likes_count, p.date 
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN users u ON p.author_id = u.user_id
        ORDER BY p.post_id
    """)
    if posts:
        print(f"{'ID':<4} | {'Category':<22} | {'Author':<15} | {'Likes':<5} | {'Title'}")
        print("-" * 80)
        for p in posts:
            title_snip = p['title'][:32] + "..." if len(p['title']) > 32 else p['title']
            cat = p['category'] or 'General'
            author = p['author'] or 'Unknown'
            print(f"{p['post_id']:<4} | {cat:<22} | {author:<15} | {p['likes_count']:<5} | {title_snip}")

    # 4. Comments
    print_separator("COMMENTS (UC-10)")
    comments = query("""
        SELECT c.comment_id, c.post_id, u.name AS user_name, c.content, c.date
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.user_id
        ORDER BY c.comment_id
    """)
    if comments:
        print(f"{'ID':<4} | {'Post ID':<7} | {'Author':<18} | {'Date':<10} | {'Comment Snippet'}")
        print("-" * 80)
        for c in comments:
            snip = c['content'].replace('\n', ' ')[:35]
            user_name = c['user_name'] or 'Anonymous'
            print(f"{c['comment_id']:<4} | {c['post_id']:<7} | {user_name:<18} | {c['date']:<10} | {snip}")

    # 5. Likes
    print_separator("LIKES (UC-11)")
    likes = query("SELECT user_id, post_id FROM post_likes ORDER BY post_id, user_id")
    if likes:
        print(f"Total Likes Recorded: {len(likes)}")
        sample_str = ', '.join([f"User {l['user_id']} -> Post {l['post_id']}" for l in likes[:8]])
        print(f"Sample (User ID -> Post ID): {sample_str} ...")

    print_separator()
    print("[Done] All database records fetched successfully.\n")

if __name__ == '__main__':
    display_database()
