"""
=============================================================================
BLOG WEBSITE - Database Management Module (MySQL with SQLite Fallback)
RGUKT RK VALLEY - Department of Computer Science
Course: Software Engineering / Web Technologies (E-3 Sem-1)
Student: P Jaswanth (Roll No. R220601)
Faculty Guide: Lingamurthy Sir
Technologies: MySQL, SQLite, Python Flask, PyMySQL
=============================================================================
"""

import os
import sqlite3
import pymysql
from werkzeug.security import generate_password_hash

# Database Configuration (XAMPP default settings)
MYSQL_HOST = os.environ.get('MYSQL_HOST', '127.0.0.1')
MYSQL_PORT = int(os.environ.get('MYSQL_PORT', 3306))
MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '')
MYSQL_DB = os.environ.get('MYSQL_DB', 'blog_db')

SQLITE_DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'blog.db')

# Global state tracking
ACTIVE_DB_TYPE = 'SQLite'
DB_STATUS_INFO = {
    'connected': False,
    'engine': 'None',
    'host': MYSQL_HOST,
    'database': MYSQL_DB,
    'message': ''
}


def get_mysql_connection(select_db=True):
    """Attempts to establish a connection to MySQL server."""
    kwargs = {
        'host': MYSQL_HOST,
        'port': MYSQL_PORT,
        'user': MYSQL_USER,
        'password': MYSQL_PASSWORD,
        'charset': 'utf8mb4',
        'cursorclass': pymysql.cursors.DictCursor,
        'connect_timeout': 3,
        'autocommit': True
    }
    if select_db:
        kwargs['database'] = MYSQL_DB
    return pymysql.connect(**kwargs)


def get_sqlite_connection():
    """Returns a SQLite connection configured for dictionary-style row access."""
    conn = sqlite3.connect(SQLITE_DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def get_db():
    """Returns an active database connection and engine type ('MySQL' or 'SQLite')."""
    global ACTIVE_DB_TYPE
    if ACTIVE_DB_TYPE == 'MySQL':
        try:
            return get_mysql_connection(), 'MySQL'
        except Exception:
            # Fall back to SQLite if MySQL dropped
            ACTIVE_DB_TYPE = 'SQLite'
            return get_sqlite_connection(), 'SQLite'
    else:
        return get_sqlite_connection(), 'SQLite'


# =============================================================================
# SEED DATA DEFINITIONS (18 Rich Blog Posts across all 6 SRS Categories)
# =============================================================================
SEED_CATEGORIES = [
    'Technology',
    'Programming',
    'Web Development',
    'Artificial Intelligence',
    'Campus Life',
    'Career Guidance'
]

SEED_USERS = [
    {
        'name': 'Jaswanth P',
        'email': 'r220601@rguktrkv.ac.in',
        'password': 'password123',
        'role': 'author',
        'bio': 'Computer Science undergraduate at RGUKT RK Valley (E-3 Sem-1, R220601). Passionate about full-stack web engineering, distributed systems, and algorithmic problem-solving.',
        'joined': 'September 2026'
    },
    {
        'name': 'System Admin',
        'email': 'admin@blog.com',
        'password': 'admin123',
        'role': 'admin',
        'bio': 'Platform Administrator for RGUKT Blog Website. Oversees user verification, content moderation, and system availability.',
        'joined': 'August 2026'
    },
    {
        'name': 'Ananya Sharma',
        'email': 'ananya@example.com',
        'password': 'user123',
        'role': 'author',
        'bio': 'Tech enthusiast, AI researcher, and active open source contributor at RGUKT RK Valley.',
        'joined': 'October 2026'
    }
]

SEED_POSTS = [
    # ------------------ 1. TECHNOLOGY ------------------
    {
        'title': 'The Evolution of Cloud Computing: From Monoliths to Serverless Architectures',
        'category': 'Technology',
        'author_email': 'r220601@rguktrkv.ac.in',
        'date': '2026-10-01',
        'image': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        'likes': 18,
        'liked_by_emails': ['admin@blog.com', 'ananya@example.com'],
        'content': """Cloud computing has revolutionized modern software engineering. In the early days, applications were built as giant monoliths deployed on expensive bare-metal servers. Today, cloud-native architectures, containerization with Docker and Kubernetes, and serverless compute paradigms have transformed how systems scale.

Key architectural transitions:
1. Virtual Machines to Container Orchestration: Microservices allow modular deployment and independent scaling.
2. Serverless Execution: Event-driven functions (like AWS Lambda and Google Cloud Functions) execute only when triggered, minimizing idle costs.
3. Edge Computing: Computing resources are pushed closer to end users, slashing latency for IoT and real-time platforms.

For RGUKT students, understanding cloud primitives is no longer optional—it is the foundational fabric of enterprise software."""
    },
    {
        'title': 'Next-Gen Cybersecurity: Implementing Zero Trust in Distributed Systems',
        'category': 'Technology',
        'author_email': 'ananya@example.com',
        'date': '2026-10-02',
        'image': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        'likes': 22,
        'liked_by_emails': ['r220601@rguktrkv.ac.in'],
        'content': """The traditional cybersecurity perimeter is obsolete. In an era of hybrid work, decentralized teams, and cloud hosting, the "castle-and-moat" security model has given way to Zero Trust Architecture (ZTA).

The core philosophy of Zero Trust is simple: "Never Trust, Always Verify."

Core implementation pillars:
- Strict Identity Verification: Multi-Factor Authentication (MFA) and granular Role-Based Access Control (RBAC).
- Least Privilege Access: Granting users and services only the bare minimum permissions needed to perform their tasks.
- Continuous Monitoring & Telemetry: Auditing access tokens, anomalous login behaviors, and encrypted network flows in real time.

Protecting student and enterprise data demands security by design, starting from the application layer up to database access controls."""
    },
    {
        'title': 'Quantum Computing in 2026: Practical Realities vs. Theoretical Hype',
        'category': 'Technology',
        'author_email': 'r220601@rguktrkv.ac.in',
        'date': '2026-10-03',
        'image': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
        'likes': 15,
        'liked_by_emails': ['admin@blog.com'],
        'content': """Quantum computing has captured headlines with promises of instant cryptographic cracking and revolutionary molecular simulations. But where does the technology stand in 2026?

Current status:
- NISQ Era (Noisy Intermediate-Scale Quantum): Today's quantum processors operate with hundreds of physical qubits, but quantum error correction remains the grand engineering challenge.
- Quantum Advantage: Achieved for specialized mathematical benchmark problems, while general-purpose quantum advantage is steadily progressing.
- Post-Quantum Cryptography (PQC): The transition to quantum-resistant encryption algorithms (like lattice-based cryptography) has already begun across global tech giants.

Exploring quantum computing algorithms with frameworks like Qiskit offers computer science undergraduates a fascinating window into the future of computation."""
    },

    # ------------------ 2. PROGRAMMING ------------------
    {
        'title': 'Mastering Python 3.11+ Performance: AsyncIO, Typing, and Optimization',
        'category': 'Programming',
        'author_email': 'r220601@rguktrkv.ac.in',
        'date': '2026-10-02',
        'image': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        'likes': 29,
        'liked_by_emails': ['ananya@example.com', 'admin@blog.com'],
        'content': """Python continues to be one of the most beloved languages in the world. With recent releases (Python 3.11 and beyond), the Faster CPython initiative has delivered massive performance gains through adaptive bytecode specialization and inlined function calls.

How to write high-performance Python:
- Harness AsyncIO for I/O Bound Tasks: Utilize asynchronous event loops when querying APIs, fetching network data, or performing concurrent database lookups.
- Strong Static Typing with Mypy: Type annotations (`typing`) improve code clarity, catch runtime bugs early, and help modern IDEs provide intelligent autocompletion.
- Memory Optimization: Using `__slots__`, generators (`yield`), and built-in `collections` like `deque` and `namedtuple` dramatically reduces overhead in large data sets.

Clean code combined with modern Python tooling unlocks both rapid prototyping and production-grade speed."""
    },
    {
        'title': 'Data Structures & Algorithms in Competitive Programming: From Graphs to DP',
        'category': 'Programming',
        'author_email': 'ananya@example.com',
        'date': '2026-10-03',
        'image': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
        'likes': 34,
        'liked_by_emails': ['r220601@rguktrkv.ac.in'],
        'content': """Competitive programming is the ultimate arena for honing analytical problem-solving and algorithmic efficiency. Whether preparing for Google Code Jam, LeetCode contests, or campus placement rounds, mastering core patterns is essential.

Key algorithmic pillars:
1. Graph Traversals: BFS for shortest paths in unweighted graphs, DFS for topological sorting, and Dijkstra's algorithm for weighted graphs.
2. Dynamic Programming (DP): Identifying overlapping subproblems and optimal substructure. Transitioning from memoization (top-down) to tabulation (bottom-up).
3. Disjoint Set Union (DSU) & Segment Trees: Indispensable for range queries and dynamic connectivity.

Consistency is key: solve two problems every day, analyze time and space complexity rigorously, and never skip post-contest editorials!"""
    },
    {
        'title': 'Clean Architecture & SOLID Principles: Writing Maintainable Software',
        'category': 'Programming',
        'author_email': 'r220601@rguktrkv.ac.in',
        'date': '2026-10-04',
        'image': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        'likes': 21,
        'liked_by_emails': ['admin@blog.com'],
        'content': """Anyone can write code that a computer understands; good programmers write code that humans can understand and maintain. The SOLID principles provide timeless rules for writing robust object-oriented software:

- S (Single Responsibility): Every class or module should have one, and only one, reason to change.
- O (Open/Closed): Software entities should be open for extension, but closed for modification.
- L (Liskov Substitution): Subtypes must be substitutable for their base types without altering correctness.
- I (Interface Segregation): Clients should not be forced to depend on methods they do not use.
- D (Dependency Inversion): High-level modules should depend on abstractions, not concrete implementations.

Applying these principles transforms tangled spaghetti code into an elegant, testable, and modular system."""
    },

    # ------------------ 3. WEB DEVELOPMENT ------------------
    {
        'title': 'Building Modern Web Applications with Flask & Bootstrap',
        'category': 'Web Development',
        'author_email': 'r220601@rguktrkv.ac.in',
        'date': '2026-10-04',
        'image': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
        'likes': 19,
        'liked_by_emails': ['admin@blog.com', 'ananya@example.com'],
        'content': """Web development has evolved dramatically over the last few years. By combining Python's lightweight and flexible Flask framework with Bootstrap's responsive utility classes, developers can quickly bootstrap full-featured applications.

In this guide, we break down:
1. Setting up virtual environments and Flask blueprints.
2. Structuring clean Jinja2 templates and modular CSS.
3. Managing state smoothly between REST APIs and modern client interfaces.

Clean code and responsive layout guarantee great user experience on both desktops and mobile devices!"""
    },
    {
        'title': 'Mastering Responsive Layouts with Bootstrap 5 & Modern CSS Grid',
        'category': 'Web Development',
        'author_email': 'ananya@example.com',
        'date': '2026-10-05',
        'image': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        'likes': 26,
        'liked_by_emails': ['r220601@rguktrkv.ac.in'],
        'content': """Designing web interfaces that look flawless on everything from a 4-inch mobile phone to a 4K desktop monitor is an art form. Bootstrap 5 provides a powerful 12-column flexbox grid system that pairs seamlessly with custom CSS Grid rules.

Key responsive strategies:
- Mobile-First Design: Structure HTML and CSS for small screens first, then progressively enhance layout using breakpoints.
- CSS Grid for 2D Layouts: While Flexbox excels at 1-dimensional component rows, CSS Grid provides unmatched control over complex 2-dimensional dashboard cards.
- Fluid Typography and Clamp: Using CSS clamp ensures headline font sizes scale smoothly without jarring breakpoint jumps.

A responsive website creates an inclusive and accessible browsing experience for every user."""
    },
    {
        'title': 'RESTful API Architecture and Real-Time WebSockets: A Practical Guide',
        'category': 'Web Development',
        'author_email': 'r220601@rguktrkv.ac.in',
        'date': '2026-10-05',
        'image': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        'likes': 17,
        'liked_by_emails': ['admin@blog.com'],
        'content': """Modern web applications rely on clean, predictable communication protocols between the browser and backend servers.

REST API Best Practices:
- Semantic HTTP Verbs: GET for retrieving, POST for creating, PUT/PATCH for updating, and DELETE for removing resources.
- Clear Status Codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, and 500 Internal Server Error.
- Stateless Sessions: Decouple server memory from client state using JSON Web Tokens (JWT) or secure HTTP-only cookies.

When real-time updates are needed—such as live chat or notification alerts—WebSockets establish a persistent, bidirectional TCP connection, eliminating wasteful HTTP polling."""
    },

    # ------------------ 4. ARTIFICIAL INTELLIGENCE ------------------
    {
        'title': 'Getting Started with Artificial Intelligence in 2026',
        'category': 'Artificial Intelligence',
        'author_email': 'ananya@example.com',
        'date': '2026-10-04',
        'image': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
        'likes': 31,
        'liked_by_emails': ['r220601@rguktrkv.ac.in', 'admin@blog.com'],
        'content': """Artificial intelligence is transforming every corner of computer science. From natural language processing to computer vision, modern machine learning models are empowering developers to build assistive intelligence into everyday software.

For students starting out at RGUKT RK Valley, the best foundation begins with linear algebra, statistics, Python data libraries (NumPy, Pandas), and understanding ethical AI engineering."""
    },
    {
        'title': 'Demystifying Large Language Models: Architecture, Attention, and Inference',
        'category': 'Artificial Intelligence',
        'author_email': 'r220601@rguktrkv.ac.in',
        'date': '2026-10-05',
        'image': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        'likes': 28,
        'liked_by_emails': ['ananya@example.com'],
        'content': """Large Language Models (LLMs) have taken the computing industry by storm. But what happens under the hood when a transformer generates text?

At the heart of modern LLMs lies the Transformer Architecture introduced in "Attention Is All You Need":
- Self-Attention Mechanism: Allows the model to weigh the relevance of different words in a sentence regardless of their distance.
- Feed-Forward Layers & Normalization: Process representations through deep neural layers with residual connections.
- Tokenization & Embeddings: Raw text is mapped into high-dimensional vector spaces where semantic similarity translates into geometric proximity.
- Temperature & Top-p Sampling: Control the randomness and creativity during decoding.

Understanding these internal mechanics enables engineers to build more accurate prompts, fine-tune domain models, and architect intelligent agent systems."""
    },
    {
        'title': 'Computer Vision in Healthcare: Automated Diagnostics & Medical Imaging',
        'category': 'Artificial Intelligence',
        'author_email': 'ananya@example.com',
        'date': '2026-10-06',
        'image': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
        'likes': 23,
        'liked_by_emails': ['r220601@rguktrkv.ac.in'],
        'content': """One of the most inspiring applications of Artificial Intelligence is in biomedical image analysis. Convolutional Neural Networks (CNNs) and Vision Transformers (ViTs) are assisting doctors by detecting early-stage pathologies with unprecedented accuracy.

Impact areas:
- Radiology: Automated screening of chest X-rays for pneumonia and tuberculosis.
- Dermatology: Classification of skin lesions to detect melanoma in early clinical stages.
- Ophthalmology: Retinal image analysis for diabetic retinopathy detection.

While AI models provide powerful decision support, human clinical oversight remains essential. Ethical validation and explainable AI (XAI) are critical for patient safety."""
    },

    # ------------------ 5. CAMPUS LIFE ------------------
    {
        'title': 'Top 5 Tips for Excelling in Engineering Semesters',
        'category': 'Campus Life',
        'author_email': 'r220601@rguktrkv.ac.in',
        'date': '2026-10-03',
        'image': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
        'likes': 25,
        'liked_by_emails': ['admin@blog.com'],
        'content': """Balancing academic projects, lab exams, and coding contests requires deliberate consistency. Here are 5 practical strategies:
1. Daily 90-minute deep work blocks for data structures.
2. Document your software requirements early (SRS is key!).
3. Keep clean Git repositories for every semester lab.
4. Collaborate actively with peer study groups.
5. Prioritize sleep and mental well-being before major evaluations."""
    },
    {
        'title': 'Inside the RGUKT RK Valley Coding Club: Hackathons, Mentorship & Collaboration',
        'category': 'Campus Life',
        'author_email': 'r220601@rguktrkv.ac.in',
        'date': '2026-10-04',
        'image': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
        'likes': 38,
        'liked_by_emails': ['ananya@example.com', 'admin@blog.com'],
        'content': """The Computer Science Department at RGUKT RK Valley boasts a vibrant culture of student-led peer learning and developer clubs. Participating in coding clubs accelerates engineering growth beyond the classroom syllabus.

What makes student developer communities impactful:
- Peer Mentorship: Senior students (E-3 and E-4) mentor juniors in competitive programming, Git, and web technologies.
- Hackathon Sprints: 24-hour hackathons cultivate rapid prototyping, team communication, and presentation skills under real deadlines.
- Open Source Contributions: Building useful campus utilities—such as event portals, mess management systems, and academic resource hubs.

Get involved early, ask questions, and build projects you are proud to showcase!"""
    },
    {
        'title': 'Balancing Academics, Sports, and Campus Events: An Undergrad Guide',
        'category': 'Campus Life',
        'author_email': 'ananya@example.com',
        'date': '2026-10-05',
        'image': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
        'likes': 20,
        'liked_by_emails': ['r220601@rguktrkv.ac.in'],
        'content': """Engineering college life is about holistic growth, not just spending twelve hours a day in front of an IDE. Maintaining physical health and active involvement in sports and cultural fests revitalizes mental energy.

Practical balance tips:
- The Time-Blocking Method: Dedicate specific hours to coursework, project development, physical exercise, and relaxation.
- Active Physical Activity: An hour of badminton, volleyball, or gym training relieves stress and boosts cognitive focus.
- Meaningful Friendships: The bonds formed in campus hostels, late-night canteen discussions, and lab sessions will stay with you for a lifetime.

Make the most of every semester at RGUKT!"""
    },

    # ------------------ 6. CAREER GUIDANCE ------------------
    {
        'title': 'Cracking On-Campus Tech Placements: The Complete Roadmap for CS Students',
        'category': 'Career Guidance',
        'author_email': 'r220601@rguktrkv.ac.in',
        'date': '2026-10-04',
        'image': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
        'likes': 42,
        'liked_by_emails': ['admin@blog.com', 'ananya@example.com'],
        'content': """On-campus placement drives are a milestone for engineering undergraduates. Preparing systematically across E-2 and E-3 semesters dramatically improves placement outcomes.

The 4-Step Placement Roadmap:
1. Coding Foundations: Master Arrays, Strings, Linked Lists, Trees, Graphs, and DP on platforms like LeetCode and GeeksforGeeks.
2. Core CS Subjects: Thoroughly revise Operating Systems (Processes, Threads, Deadlocks), DBMS (SQL queries, Normalization, ACID properties), and Computer Networks.
3. Impressive Projects: Build 2-3 production-grade full-stack applications with clear architecture, live deployment, and clean GitHub documentation.
4. Mock Interviews: Practice articulating your problem-solving thought process aloud before the interview panel."""
    },
    {
        'title': 'How to Build a Standout GitHub Portfolio and Open Source Profile',
        'category': 'Career Guidance',
        'author_email': 'ananya@example.com',
        'date': '2026-10-05',
        'image': 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=800&q=80',
        'likes': 33,
        'liked_by_emails': ['r220601@rguktrkv.ac.in'],
        'content': """Your GitHub profile is your living resume as a software developer. Recruiters and engineering managers value active code repositories far more than a static PDF.

Key elements of a standout profile:
- Comprehensive README Files: Every repository should include an architecture overview, screenshots, installation instructions, and tech stack badges.
- Clean Commit History: Write meaningful commit messages that reflect incremental development rather than a single massive dump.
- Meaningful Open Source Contributions: Begin by solving "good first issues" in popular open-source projects, improving documentation, or creating bug fixes.
- Live Deployment Links: Always host your frontend on platforms like Vercel or GitHub Pages and your backend on cloud providers with accessible demo links."""
    },
    {
        'title': 'Ace the Technical Interview: System Design & Behavioral Preparation',
        'category': 'Career Guidance',
        'author_email': 'r220601@rguktrkv.ac.in',
        'date': '2026-10-06',
        'image': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
        'likes': 27,
        'liked_by_emails': ['admin@blog.com'],
        'content': """Succeeding in technical interviews requires more than just passing unit tests in coding rounds. Senior interviewers evaluate how you design systems and communicate in team environments.

Key preparation areas:
- System Design Fundamentals: Understand horizontal vs. vertical scaling, database sharding, caching strategies with Redis, and load balancing algorithms.
- The STAR Method for Behavioral Questions: Structure responses around Situation, Task, Action, and Result when discussing past challenges or leadership roles.
- Clarifying Requirements: Always ask questions before writing code—clarify input constraints, corner cases, and performance expectations.
- Positive Attitude: Treat the interview as a collaborative discussion with a fellow engineer."""
    },
    {
        'title': 'ASTRA',
        'category': 'Artificial Intelligence',
        'author_email': 'r220601@rguktrkv.ac.in',
        'date': '2026-10-06',
        'image': 'uploads/upload_3e9a2cc7340d.png',
        'likes': 0,
        'liked_by_emails': [],
        'content': """# GPT-6 Astra: A New Generation of AI Intelligence

Artificial intelligence is rapidly moving from simply answering questions to actually helping people complete complex tasks—and GPT-6 Astra represents a major step in that direction.

GPT-6 Astra is OpenAI’s most capable model for demanding reasoning, coding, research, computer use, and professional work. It combines advanced reasoning with the ability to work across browsers, software, files, and multi-step workflows, making it more than just a conversational AI assistant.

One of Astra’s biggest strengths is its ability to handle **complex tasks from start to finish**. It can help developers understand and fix code, assist researchers with scientific problems, browse information, work with documents and spreadsheets, and interact with computer applications. Its large context window also allows it to work with substantial amounts of information while maintaining the broader context of a task.

### What makes GPT-6 Astra different?

Astra is designed around several important capabilities:

* **Advanced reasoning** – Designed for difficult, multi-step problems.
* **Software engineering** – Helps write, understand, debug, and improve complex code.
* **Computer use** – Can interact with websites and computer applications to complete workflows.
* **Research and browsing** – Can gather and work with information using supported tools.
* **Professional work** – Can create and work with documents, spreadsheets, presentations, and analyses.
* **Science and mathematics** – Built to tackle challenging scientific and mathematical problems.
* **Better instruction following** – Astra is designed to understand changing requirements and maintain the overall goal of a task.

What makes this especially interesting is the shift from **“AI that gives you an answer” to “AI that can help get the work done.”** Instead of stopping after generating a piece of code or explaining a concept, Astra can potentially take the next steps—working through tools, applications, and multi-stage workflows.

Of course, powerful AI also comes with significant responsibility. OpenAI highlights stronger safety and alignment measures for Astra, particularly because its capabilities in areas such as computer use and cybersecurity are substantially more advanced.

### The bigger picture

GPT-6 Astra is part of a broader shift in AI toward systems that can reason, use tools, understand context, and collaborate with humans on real-world tasks. Its significance is not simply that it can produce better answers—it is that AI is increasingly becoming capable of participating in the process of **researching, creating, analyzing, coding, and executing work**.

For students, developers, researchers, and professionals, this could change how we approach everyday tasks. The future of AI may not be about replacing human creativity and decision-making, but about giving people increasingly capable tools to explore ideas and accomplish more.

**GPT-6 Astra points toward that future: AI that doesn't just respond—it reasons, works, and helps turn ideas into results.**"""
    }
]

SEED_COMMENTS = [
    {
        'post_index': 0, # Cloud Computing
        'user_email': 'ananya@example.com',
        'content': 'Great breakdown of serverless vs containers! This clarifies cloud architecture so well.',
        'date': '2026-10-01 16:45'
    },
    {
        'post_index': 3, # Python
        'user_email': 'admin@blog.com',
        'content': 'AsyncIO and typing make a huge difference in code maintainability. Super informative post.',
        'date': '2026-10-02 18:20'
    },
    {
        'post_index': 6, # Web Dev Flask & Bootstrap
        'user_email': 'ananya@example.com',
        'content': 'Bootstrap 5 grid makes responsiveness so seamless. Clean setup!',
        'date': '2026-10-04 14:30'
    },
    {
        'post_index': 6,
        'user_email': 'admin@blog.com',
        'content': 'Very well structured post. Keep up the high standard.',
        'date': '2026-10-04 16:15'
    },
    {
        'post_index': 9, # AI
        'user_email': 'r220601@rguktrkv.ac.in',
        'content': 'Completely agree. Strong fundamentals in linear algebra and python make AI concepts much easier.',
        'date': '2026-10-05 10:20'
    },
    {
        'post_index': 15, # Career Placements
        'user_email': 'ananya@example.com',
        'content': 'This roadmap is gold for E-3 students preparing for campus placements! Thank you Jaswanth.',
        'date': '2026-10-04 20:10'
    }
]


# =============================================================================
# TABLE CREATION SCHEMAS (Matching SRS Section 9 & Figure 3 ER Diagram)
# =============================================================================
MYSQL_TABLE_SCHEMAS = [
    """
    CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'author', 'admin') DEFAULT 'author',
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """,
    """
    CREATE TABLE IF NOT EXISTS categories (
        category_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """,
    """
    CREATE TABLE IF NOT EXISTS posts (
        post_id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content LONGTEXT NOT NULL,
        author_id INT NOT NULL,
        category_id INT NOT NULL,
        date DATE NOT NULL,
        image_url VARCHAR(500),
        likes_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """,
    """
    CREATE TABLE IF NOT EXISTS comments (
        comment_id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        date VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """,
    """
    CREATE TABLE IF NOT EXISTS images (
        image_id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(50) DEFAULT 'image/jpeg',
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """,
    """
    CREATE TABLE IF NOT EXISTS post_likes (
        like_id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_post_like (post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """
]

SQLITE_TABLE_SCHEMAS = [
    """
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'author',
        bio TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS categories (
        category_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS posts (
        post_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        image_url TEXT,
        likes_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS comments (
        comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS images (
        image_id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        file_path TEXT NOT NULL,
        file_type TEXT DEFAULT 'image/jpeg',
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS post_likes (
        like_id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
    """
]


def init_database():
    """
    Initializes the database:
    1. Tests MySQL connection (e.g. XAMPP on localhost:3306).
    2. If MySQL connects, sets up schema and seeds.
    3. If MySQL fails, seamlessly sets up SQLite schema and seeds.
    """
    global ACTIVE_DB_TYPE, DB_STATUS_INFO
    
    # First: Try MySQL
    try:
        # Step 1: Connect to MySQL server without database to create DB if needed
        conn = get_mysql_connection(select_db=False)
        with conn.cursor() as cur:
            cur.execute(f"CREATE DATABASE IF NOT EXISTS `{MYSQL_DB}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        conn.close()

        # Step 2: Connect to the created database
        db_conn = get_mysql_connection(select_db=True)
        with db_conn.cursor() as cur:
            for schema in MYSQL_TABLE_SCHEMAS:
                cur.execute(schema)

            # Check if users already exist
            cur.execute("SELECT COUNT(*) AS cnt FROM users;")
            user_count = cur.fetchone()['cnt']
            if user_count == 0:
                _seed_mysql_database(db_conn)

        db_conn.close()
        ACTIVE_DB_TYPE = 'MySQL'
        DB_STATUS_INFO = {
            'connected': True,
            'engine': 'MySQL',
            'host': f"{MYSQL_HOST}:{MYSQL_PORT}",
            'database': MYSQL_DB,
            'message': 'Connected to MySQL server (XAMPP/Local) successfully.'
        }
        print("[Database] Connected to MySQL successfully! Database:", MYSQL_DB)
        return 'MySQL'
    except Exception as e:
        # Fall back to SQLite
        print(f"[Database] MySQL connection notice ({e}). Falling back to SQLite database: {SQLITE_DB_PATH}")
        ACTIVE_DB_TYPE = 'SQLite'
        _init_sqlite_database()
        DB_STATUS_INFO = {
            'connected': True,
            'engine': 'SQLite',
            'host': 'Local File (Auto-fallback)',
            'database': 'blog.db',
            'message': f'Active on SQLite fallback. (MySQL notice: {str(e)[:70]}...)'
        }
        print("[Database] SQLite fallback initialized successfully!")
        return 'SQLite'


def _init_sqlite_database():
    """Initializes SQLite database tables and seeds data."""
    conn = get_sqlite_connection()
    cur = conn.cursor()
    for schema in SQLITE_TABLE_SCHEMAS:
        cur.executescript(schema)
    
    cur.execute("SELECT COUNT(*) FROM users;")
    if cur.fetchone()[0] == 0:
        _seed_sqlite_database(conn)
    conn.commit()
    conn.close()


def _seed_mysql_database(conn):
    """Seeds initial users, categories, 18 blog posts, and comments into MySQL."""
    with conn.cursor() as cur:
        # 1. Insert Categories
        for cat in SEED_CATEGORIES:
            cur.execute("INSERT IGNORE INTO categories (name) VALUES (%s);", (cat,))

        # 2. Insert Users
        user_id_map = {}
        for u in SEED_USERS:
            hashed_pwd = generate_password_hash(u['password'])
            cur.execute(
                "INSERT INTO users (name, email, password, role, bio) VALUES (%s, %s, %s, %s, %s);",
                (u['name'], u['email'], hashed_pwd, u['role'], u['bio'])
            )
            cur.execute("SELECT user_id FROM users WHERE email = %s;", (u['email'],))
            user_id_map[u['email']] = cur.fetchone()['user_id']

        # Get category IDs
        cur.execute("SELECT category_id, name FROM categories;")
        cat_rows = cur.fetchall()
        cat_id_map = {row['name']: row['category_id'] for row in cat_rows}

        # 3. Insert Posts
        post_ids = []
        for p in SEED_POSTS:
            author_id = user_id_map.get(p['author_email'])
            category_id = cat_id_map.get(p['category'])
            cur.execute(
                """
                INSERT INTO posts (title, content, author_id, category_id, date, image_url, likes_count)
                VALUES (%s, %s, %s, %s, %s, %s, %s);
                """,
                (p['title'], p['content'], author_id, category_id, p['date'], p['image'], p['likes'])
            )
            cur.execute("SELECT LAST_INSERT_ID() as pid;")
            pid = cur.fetchone()['pid']
            post_ids.append(pid)

            # Seed Likes
            for email in p.get('liked_by_emails', []):
                uid = user_id_map.get(email)
                if uid:
                    cur.execute(
                        "INSERT IGNORE INTO post_likes (post_id, user_id) VALUES (%s, %s);",
                        (pid, uid)
                    )

        # 4. Insert Comments
        for c in SEED_COMMENTS:
            pid = post_ids[c['post_index']]
            uid = user_id_map.get(c['user_email'])
            cur.execute(
                """
                INSERT INTO comments (post_id, user_id, content, date)
                VALUES (%s, %s, %s, %s);
                """,
                (pid, uid, c['content'], c['date'])
            )


def _seed_sqlite_database(conn):
    """Seeds initial users, categories, 18 blog posts, and comments into SQLite."""
    cur = conn.cursor()
    # 1. Categories
    for cat in SEED_CATEGORIES:
        cur.execute("INSERT OR IGNORE INTO categories (name) VALUES (?);", (cat,))

    # 2. Users
    user_id_map = {}
    for u in SEED_USERS:
        hashed_pwd = generate_password_hash(u['password'])
        cur.execute(
            "INSERT INTO users (name, email, password, role, bio) VALUES (?, ?, ?, ?, ?);",
            (u['name'], u['email'], hashed_pwd, u['role'], u['bio'])
        )
        user_id_map[u['email']] = cur.lastrowid

    # Category map
    cur.execute("SELECT category_id, name FROM categories;")
    cat_id_map = {row[1]: row[0] for row in cur.fetchall()}

    # 3. Posts
    post_ids = []
    for p in SEED_POSTS:
        author_id = user_id_map.get(p['author_email'])
        category_id = cat_id_map.get(p['category'])
        cur.execute(
            """
            INSERT INTO posts (title, content, author_id, category_id, date, image_url, likes_count)
            VALUES (?, ?, ?, ?, ?, ?, ?);
            """,
            (p['title'], p['content'], author_id, category_id, p['date'], p['image'], p['likes'])
        )
        pid = cur.lastrowid
        post_ids.append(pid)

        # Likes
        for email in p.get('liked_by_emails', []):
            uid = user_id_map.get(email)
            if uid:
                cur.execute(
                    "INSERT OR IGNORE INTO post_likes (post_id, user_id) VALUES (?, ?);",
                    (pid, uid)
                )

    # 4. Comments
    for c in SEED_COMMENTS:
        pid = post_ids[c['post_index']]
        uid = user_id_map.get(c['user_email'])
        cur.execute(
            """
            INSERT INTO comments (post_id, user_id, content, date)
            VALUES (?, ?, ?, ?);
            """,
            (pid, uid, c['content'], c['date'])
        )
    conn.commit()


def get_db_status():
    """Returns database connection telemetry and table record counts."""
    global ACTIVE_DB_TYPE, DB_STATUS_INFO
    stats = {
        'engine': ACTIVE_DB_TYPE,
        'connected': True,
        'host': DB_STATUS_INFO.get('host'),
        'database': DB_STATUS_INFO.get('database'),
        'counts': {'users': 0, 'posts': 0, 'categories': 0, 'comments': 0, 'likes': 0}
    }
    try:
        conn, engine = get_db()
        if engine == 'MySQL':
            with conn.cursor() as cur:
                cur.execute("SELECT COUNT(*) AS c FROM users;")
                stats['counts']['users'] = cur.fetchone()['c']
                cur.execute("SELECT COUNT(*) AS c FROM posts;")
                stats['counts']['posts'] = cur.fetchone()['c']
                cur.execute("SELECT COUNT(*) AS c FROM categories;")
                stats['counts']['categories'] = cur.fetchone()['c']
                cur.execute("SELECT COUNT(*) AS c FROM comments;")
                stats['counts']['comments'] = cur.fetchone()['c']
                cur.execute("SELECT COUNT(*) AS c FROM post_likes;")
                stats['counts']['likes'] = cur.fetchone()['c']
            conn.close()
        else:
            cur = conn.cursor()
            cur.execute("SELECT COUNT(*) FROM users;")
            stats['counts']['users'] = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM posts;")
            stats['counts']['posts'] = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM categories;")
            stats['counts']['categories'] = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM comments;")
            stats['counts']['comments'] = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM post_likes;")
            stats['counts']['likes'] = cur.fetchone()[0]
            conn.close()
    except Exception as e:
        stats['error'] = str(e)
    return stats
