# BLOG WEBSITE — Software Requirement Specifications (SRS) Project

**Institution:** Rajiv Gandhi University of Knowledge Technologies (RGUKT RK Valley)  
**Department:** Department of Computer Science  
**Semester:** E-3 Sem-1  
**Student Name:** P Jaswanth  
**Roll No:** R220601  
**Email:** r220601@rguktrkv.ac.in  
**Faculty Guide:** Lingamurthy Sir  

---

## 🛠️ Tech Stack (As Specified in SRS Section 2.2)

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), Bootstrap 5 | Modern, responsive client UI with real-time DOM updates |
| **Backend** | Python Flask | REST API endpoints for all 12 SRS Use Cases |
| **Database** | MySQL (with SQLite Auto-Fallback) | Relational schema matching Figure 3 ER Diagram |
| **Development** | Visual Studio Code, XAMPP | Standard student engineering environment |

---

## 📚 Blog Posts on Each Topic (18 Total Posts)

The platform now contains **3 comprehensive, high-quality blog posts for every topic/category** defined in the SRS:

### 1. Technology
1. **The Evolution of Cloud Computing: From Monoliths to Serverless Architectures** (Author: Jaswanth P)
2. **Next-Gen Cybersecurity: Implementing Zero Trust in Distributed Systems** (Author: Ananya Sharma)
3. **Quantum Computing in 2026: Practical Realities vs. Theoretical Hype** (Author: Jaswanth P)

### 2. Programming
1. **Mastering Python 3.11+ Performance: AsyncIO, Typing, and Optimization** (Author: Jaswanth P)
2. **Data Structures & Algorithms in Competitive Programming: From Graphs to DP** (Author: Ananya Sharma)
3. **Clean Architecture & SOLID Principles: Writing Maintainable Software** (Author: Jaswanth P)

### 3. Web Development
1. **Building Modern Web Applications with Flask & Bootstrap** (Author: Jaswanth P)
2. **Mastering Responsive Layouts with Bootstrap 5 & Modern CSS Grid** (Author: Ananya Sharma)
3. **RESTful API Architecture and Real-Time WebSockets: A Practical Guide** (Author: Jaswanth P)

### 4. Artificial Intelligence
1. **Getting Started with Artificial Intelligence in 2026** (Author: Ananya Sharma)
2. **Demystifying Large Language Models: Architecture, Attention, and Inference** (Author: Jaswanth P)
3. **Computer Vision in Healthcare: Automated Diagnostics & Medical Imaging** (Author: Ananya Sharma)

### 5. Campus Life
1. **Top 5 Tips for Excelling in Engineering Semesters** (Author: Jaswanth P)
2. **Inside the RGUKT RK Valley Coding Club: Hackathons, Mentorship & Collaboration** (Author: Jaswanth P)
3. **Balancing Academics, Sports, and Campus Events: An Undergrad Guide** (Author: Ananya Sharma)

### 6. Career Guidance
1. **Cracking On-Campus Tech Placements: The Complete Roadmap for CS Students** (Author: Jaswanth P)
2. **How to Build a Standout GitHub Portfolio and Open Source Profile** (Author: Ananya Sharma)
3. **Ace the Technical Interview: System Design & Behavioral Preparation** (Author: Jaswanth P)

---

## 🗄️ Database Architecture (SRS Section 9 & Figure 3 ER Diagram)

The database consists of 6 relational tables:
1. `users`: Stores user profile details (`user_id`, `name`, `email`, `password` hashed, `role`, `bio`).
2. `categories`: Stores category classification (`category_id`, `name`).
3. `posts`: Stores blog posts (`post_id`, `title`, `content`, `author_id` FK, `category_id` FK, `date`, `image_url`, `likes_count`).
4. `comments`: Stores reader comments (`comment_id`, `post_id` FK, `user_id` FK, `content`, `date`).
5. `images`: Stores image files attached to posts (`image_id`, `post_id` FK, `file_path`, `file_type`).
6. `post_likes`: Tracks user likes per post for reactive toggling (`like_id`, `post_id` FK, `user_id` FK).

Full SQL script ready for XAMPP phpMyAdmin import is in [`database.sql`](file:///c:/Users/jassu/Desktop/New%20folder/database.sql).

---

## 🎯 Implementation of SRS Functional Requirements

| Use Case ID | Use Case Name | Actor(s) | Implementation Status |
|---|---|---|---|
| **UC-01** | Register Account | Visitor | `POST /api/auth/register` + hashed password storage + registration modal |
| **UC-02** | Log In | Visitor / User / Admin | `POST /api/auth/login` + session management + quick switcher |
| **UC-03** | Manage Profile | Author / Registered User | `GET/PUT /api/auth/profile/<id>` + profile update form + authored posts |
| **UC-04** | Create Blog Post | Author | `POST /api/posts` + validation + instant category & DB sync |
| **UC-05** | Edit Blog Post | Author / Admin | `PUT /api/posts/<id>` + ownership verification |
| **UC-06** | Delete Blog Post | Author / Admin | `DELETE /api/posts/<id>` + confirmation modal |
| **UC-07** | View Blog Post | Visitor / Registered User | `GET /api/posts/<id>` + full content, comments, and like counter |
| **UC-08** | Search & Browse Posts | Visitor / Registered User | `GET /api/posts?category=...&search=...` + real-time search bar & category pills |
| **UC-09** | Add Image to Post | Author | `POST /api/upload` + HTML5 file preview + server storage in `uploads/` |
| **UC-10** | Post a Comment | Registered User / Author | `POST /api/posts/<id>/comments` + timestamped comment thread |
| **UC-11** | Like a Post | Registered User / Author | `POST /api/posts/<id>/like` + persistent toggle in `post_likes` table |
| **UC-12** | Administrator Management | Administrator | `GET /api/admin/stats` + moderation tables to manage posts, users & comments |

---

## 🔑 Pre-Configured Demo Accounts (For Viva Evaluation)

Use the quick-switch pills in the top banner or log in manually:

1. **Author Account (Jaswanth P)**
   - **Email:** `r220601@rguktrkv.ac.in`
   - **Password:** `password123`
   - **Role:** Author (can create, edit, delete own posts, like, and comment)

2. **Administrator Account (System Admin)**
   - **Email:** `admin@blog.com`
   - **Password:** `admin123`
   - **Role:** Administrator (can access Admin Dashboard, delete any post/comment/user)

3. **Visitor (Guest)**
   - Unauthenticated mode to test reading posts, searching, and viewing without edit privileges.

---

## 🚀 How to Run the Project

### Option 1: Run with Python Flask (Full Backend + Database Sync)
```bash
python app.py
```
Open your browser and navigate to:
```
http://127.0.0.1:5000
```
- Click the **Database** button in the header banner to view real-time connection status and record counts.
- For XAMPP MySQL setup instructions, see [`XAMPP_MYSQL_GUIDE.md`](file:///c:/Users/jassu/Desktop/New%20folder/XAMPP_MYSQL_GUIDE.md).

### Option 2: Direct Browser Opening (Standalone Offline Mode)
Simply double-click `index.html` to open it in Chrome, Edge, or Firefox. The application includes all 18 posts and client-side persistence even without a running server.

---

## 📂 Project Directory Structure

```
c:\Users\jassu\Desktop\New folder\
├── index.html              # Main Single Page Application (all views, modals, cards)
├── css\
│   └── style.css           # Custom responsive styles, cards, badges, animations
├── js\
│   └── app.js              # Client logic, 18-post seed, and dual-mode REST backend API sync
├── app.py                  # Python Flask REST API server (all 12 SRS use cases)
├── db.py                   # Database engine (MySQL connection with SQLite auto-fallback)
├── database.sql            # Full MySQL schema + 18-post seed script for XAMPP phpMyAdmin
├── blog.db                 # SQLite database file with all tables and data pre-seeded
├── uploads\                # Directory storing uploaded post images (UC-09)
├── XAMPP_MYSQL_GUIDE.md    # Guide for setting up MySQL with XAMPP
└── README.md               # Project documentation and SRS requirements mapping
```
