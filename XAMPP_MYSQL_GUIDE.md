# XAMPP & MySQL Database Setup Guide
**RGUKT RK VALLEY - Department of Computer Science**  
**Project:** Software Requirement Specifications - Blog Website  
**Student:** P Jaswanth (Roll No. R220601)  
**Faculty Guide:** Lingamurthy Sir  

---

## 📌 Overview

As specified in **Section 2.2 Technologies** of the SRS document, the Blog Website uses:
- **Backend:** Python Flask
- **Database:** MySQL
- **Environment:** Visual Studio Code & XAMPP (Apache & MySQL)

The application comes with **Dual-Database Support**:
1. **MySQL (Production / XAMPP):** Targets `localhost:3306` with database `blog_db`.
2. **SQLite (Automatic Fallback):** If MySQL server or XAMPP is not currently started, the application automatically initializes and persists all data to `blog.db` without crashing.

---

## 🚀 How to Set Up MySQL in XAMPP (Step-by-Step)

### Step 1: Start MySQL in XAMPP Control Panel
1. Open the **XAMPP Control Panel** from your Desktop or `C:\xampp\xampp-control.exe`.
2. Click **Start** next to **MySQL** (and **Apache** if you want to use phpMyAdmin).
3. Ensure MySQL shows green with port `3306`.

### Step 2: Import the Database in phpMyAdmin
1. Open your browser and go to:
   ```
   http://localhost/phpmyadmin
   ```
2. Click on the **Import** tab at the top.
3. Click **Choose File** and select:
   ```
   c:\Users\jassu\Desktop\New folder\database.sql
   ```
4. Scroll to the bottom and click **Import** (or **Go**).
5. The database `blog_db` will be created with all 6 tables and 18 blog posts:
   - `users` (3 accounts: Jaswanth P, System Admin, Ananya Sharma)
   - `categories` (6 topics: Technology, Programming, Web Development, Artificial Intelligence, Campus Life, Career Guidance)
   - `posts` (18 detailed blog posts, 3 per topic)
   - `comments`
   - `images`
   - `post_likes`

---

## ⚙️ Configuring MySQL Password in Flask (If Applicable)

By default, XAMPP uses:
- **Host:** `127.0.0.1`
- **Port:** `3306`
- **User:** `root`
- **Password:** ` ` (empty password)
- **Database:** `blog_db`

If your MySQL root user has a custom password, you can set it before starting the Flask server:

### In PowerShell:
```powershell
$env:MYSQL_PASSWORD = "your_mysql_password"
python app.py
```

### In Command Prompt:
```cmd
set MYSQL_PASSWORD=your_mysql_password
python app.py
```

---

## 🏃 Running the Application

In your project directory, run:
```bash
python app.py
```

Then open your browser to:
```
http://127.0.0.1:5000
```

You will see the green status pill in the top banner:
`🟢 Backend: Flask | DB: MySQL` (or `DB: SQLite` if using local fallback). Click the **Database** button in the header at any time to inspect live connection telemetry and record counts!
