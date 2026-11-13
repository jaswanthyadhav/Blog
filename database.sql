-- =============================================================================
-- BLOG WEBSITE - MySQL Database Schema & Seed Data
-- RGUKT RK VALLEY - Department of Computer Science
-- Student: P Jaswanth (Roll No. R220601)
-- Faculty: Lingamurthy Sir
-- SRS Project: Software Requirement Specifications - Blog Website
-- Compatible with: MySQL 8.0, MariaDB 10.4+, XAMPP / phpMyAdmin
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `blog_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `blog_db`;

-- Drop existing tables if re-importing
DROP TABLE IF EXISTS `post_likes`;
DROP TABLE IF EXISTS `images`;
DROP TABLE IF EXISTS `comments`;
DROP TABLE IF EXISTS `posts`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

-- -----------------------------------------------------------------------------
-- 1. Table: users (Matches SRS Section 9.1 & ER Diagram)
-- -----------------------------------------------------------------------------
CREATE TABLE `users` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('user', 'author', 'admin') DEFAULT 'author',
    `bio` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 2. Table: categories (Matches SRS Section 9.1 & ER Diagram)
-- -----------------------------------------------------------------------------
CREATE TABLE `categories` (
    `category_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 3. Table: posts (Matches SRS Section 9.1 & ER Diagram)
-- -----------------------------------------------------------------------------
CREATE TABLE `posts` (
    `post_id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `author_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `image_url` VARCHAR(500),
    `likes_count` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_posts_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_posts_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 4. Table: comments (Matches SRS Section 9.1 & ER Diagram)
-- -----------------------------------------------------------------------------
CREATE TABLE `comments` (
    `comment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `post_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `content` TEXT NOT NULL,
    `date` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_comments_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_comments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 5. Table: images (Matches SRS Section 9.1 & ER Diagram)
-- -----------------------------------------------------------------------------
CREATE TABLE `images` (
    `image_id` INT AUTO_INCREMENT PRIMARY KEY,
    `post_id` INT NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `file_type` VARCHAR(50) DEFAULT 'image/jpeg',
    `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_images_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 6. Table: post_likes (Tracks individual user likes for real-time toggle)
-- -----------------------------------------------------------------------------
CREATE TABLE `post_likes` (
    `like_id` INT AUTO_INCREMENT PRIMARY KEY,
    `post_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_post_user_like` (`post_id`, `user_id`),
    CONSTRAINT `fk_likes_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_likes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- SEED DATA INSERTIONS
-- =============================================================================

-- Categories (6 core topics)
INSERT INTO `categories` (`category_id`, `name`) VALUES
(1, 'Technology'),
(2, 'Programming'),
(3, 'Web Development'),
(4, 'Artificial Intelligence'),
(5, 'Campus Life'),
(6, 'Career Guidance');

-- Users (Jaswanth P, System Admin, Ananya Sharma)
-- Note: Passwords hashed with scrypt/werkzeug; plaintexts: password123, admin123, user123
INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `role`, `bio`) VALUES
(1, 'Jaswanth P', 'r220601@rguktrkv.ac.in', 'scrypt:32768:8:1$7t8YwWb188rOvd3E$e3d93cbcfbc8b150965dcb2a3f7f45c993d0d8feeeceea23c4a4e1d13f59faae81b9bbf5b8f2a2faeb253b34ce9db8daeef59d1a1bfaee3a65239e1a8fa15e98', 'author', 'Computer Science undergraduate at RGUKT RK Valley (E-3 Sem-1, R220601). Passionate about full-stack web engineering, distributed systems, and algorithmic problem-solving.'),
(2, 'System Admin', 'admin@blog.com', 'scrypt:32768:8:1$7t8YwWb188rOvd3E$e3d93cbcfbc8b150965dcb2a3f7f45c993d0d8feeeceea23c4a4e1d13f59faae81b9bbf5b8f2a2faeb253b34ce9db8daeef59d1a1bfaee3a65239e1a8fa15e98', 'admin', 'Platform Administrator for RGUKT Blog Website. Oversees user verification, content moderation, and system availability.'),
(3, 'Ananya Sharma', 'ananya@example.com', 'scrypt:32768:8:1$7t8YwWb188rOvd3E$e3d93cbcfbc8b150965dcb2a3f7f45c993d0d8feeeceea23c4a4e1d13f59faae81b9bbf5b8f2a2faeb253b34ce9db8daeef59d1a1bfaee3a65239e1a8fa15e98', 'author', 'Tech enthusiast, AI researcher, and active open source contributor at RGUKT RK Valley.');

-- 18 Blog Posts (3 on each topic)
INSERT INTO `posts` (`post_id`, `title`, `content`, `author_id`, `category_id`, `date`, `image_url`, `likes_count`) VALUES
-- Topic 1: Technology
(1, 'The Evolution of Cloud Computing: From Monoliths to Serverless Architectures', 'Cloud computing has revolutionized modern software engineering. In the early days, applications were built as giant monoliths deployed on expensive bare-metal servers. Today, cloud-native architectures, containerization with Docker and Kubernetes, and serverless compute paradigms have transformed how systems scale.\n\nKey architectural transitions:\n1. Virtual Machines to Container Orchestration: Microservices allow modular deployment and independent scaling.\n2. Serverless Execution: Event-driven functions (like AWS Lambda and Google Cloud Functions) execute only when triggered, minimizing idle costs.\n3. Edge Computing: Computing resources are pushed closer to end users, slashing latency for IoT and real-time platforms.\n\nFor RGUKT students, understanding cloud primitives is no longer optional—it is the foundational fabric of enterprise software.', 1, 1, '2026-10-01', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', 18),
(2, 'Next-Gen Cybersecurity: Implementing Zero Trust in Distributed Systems', 'The traditional cybersecurity perimeter is obsolete. In an era of hybrid work, decentralized teams, and cloud hosting, the "castle-and-moat" security model has given way to Zero Trust Architecture (ZTA).\n\nThe core philosophy of Zero Trust is simple: "Never Trust, Always Verify."\n\nCore implementation pillars:\n- Strict Identity Verification: Multi-Factor Authentication (MFA) and granular Role-Based Access Control (RBAC).\n- Least Privilege Access: Granting users and services only the bare minimum permissions needed to perform their tasks.\n- Continuous Monitoring & Telemetry: Auditing access tokens, anomalous login behaviors, and encrypted network flows in real time.\n\nProtecting student and enterprise data demands security by design, starting from the application layer up to database access controls.', 3, 1, '2026-10-02', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', 22),
(3, 'Quantum Computing in 2026: Practical Realities vs. Theoretical Hype', 'Quantum computing has captured headlines with promises of instant cryptographic cracking and revolutionary molecular simulations. But where does the technology stand in 2026?\n\nCurrent status:\n- NISQ Era (Noisy Intermediate-Scale Quantum): Today''s quantum processors operate with hundreds of physical qubits, but quantum error correction remains the grand engineering challenge.\n- Quantum Advantage: Achieved for specialized mathematical benchmark problems, while general-purpose quantum advantage is steadily progressing.\n- Post-Quantum Cryptography (PQC): The transition to quantum-resistant encryption algorithms (like lattice-based cryptography) has already begun across global tech giants.\n\nExploring quantum computing algorithms with frameworks like Qiskit offers computer science undergraduates a fascinating window into the future of computation.', 1, 1, '2026-10-03', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80', 15),

-- Topic 2: Programming
(4, 'Mastering Python 3.11+ Performance: AsyncIO, Typing, and Optimization', 'Python continues to be one of the most beloved languages in the world. With recent releases (Python 3.11 and beyond), the Faster CPython initiative has delivered massive performance gains through adaptive bytecode specialization and inlined function calls.\n\nHow to write high-performance Python:\n- Harness AsyncIO for I/O Bound Tasks: Utilize asynchronous event loops when querying APIs, fetching network data, or performing concurrent database lookups.\n- Strong Static Typing with Mypy: Type annotations (typing) improve code clarity, catch runtime bugs early, and help modern IDEs provide intelligent autocompletion.\n- Memory Optimization: Using __slots__, generators (yield), and built-in collections like deque and namedtuple dramatically reduces overhead in large data sets.\n\nClean code combined with modern Python tooling unlocks both rapid prototyping and production-grade speed.', 1, 2, '2026-10-02', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', 29),
(5, 'Data Structures & Algorithms in Competitive Programming: From Graphs to DP', 'Competitive programming is the ultimate arena for honing analytical problem-solving and algorithmic efficiency. Whether preparing for Google Code Jam, LeetCode contests, or campus placement rounds, mastering core patterns is essential.\n\nKey algorithmic pillars:\n1. Graph Traversals: BFS for shortest paths in unweighted graphs, DFS for topological sorting, and Dijkstra''s algorithm for weighted graphs.\n2. Dynamic Programming (DP): Identifying overlapping subproblems and optimal substructure. Transitioning from memoization (top-down) to tabulation (bottom-up).\n3. Disjoint Set Union (DSU) & Segment Trees: Indispensable for range queries and dynamic connectivity.\n\nConsistency is key: solve two problems every day, analyze time and space complexity rigorously, and never skip post-contest editorials!', 3, 2, '2026-10-03', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80', 34),
(6, 'Clean Architecture & SOLID Principles: Writing Maintainable Software', 'Anyone can write code that a computer understands; good programmers write code that humans can understand and maintain. The SOLID principles provide timeless rules for writing robust object-oriented software:\n\n- S (Single Responsibility): Every class or module should have one, and only one, reason to change.\n- O (Open/Closed): Software entities should be open for extension, but closed for modification.\n- L (Liskov Substitution): Subtypes must be substitutable for their base types without altering correctness.\n- I (Interface Segregation): Clients should not be forced to depend on methods they do not use.\n- D (Dependency Inversion): High-level modules should depend on abstractions, not concrete implementations.\n\nApplying these principles transforms tangled spaghetti code into an elegant, testable, and modular system.', 1, 2, '2026-10-04', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80', 21),

-- Topic 3: Web Development
(7, 'Building Modern Web Applications with Flask & Bootstrap', 'Web development has evolved dramatically over the last few years. By combining Python''s lightweight and flexible Flask framework with Bootstrap''s responsive utility classes, developers can quickly bootstrap full-featured applications.\n\nIn this guide, we break down:\n1. Setting up virtual environments and Flask blueprints.\n2. Structuring clean Jinja2 templates and modular CSS.\n3. Managing state smoothly between REST APIs and modern client interfaces.\n\nClean code and responsive layout guarantee great user experience on both desktops and mobile devices!', 1, 3, '2026-10-04', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80', 19),
(8, 'Mastering Responsive Layouts with Bootstrap 5 & Modern CSS Grid', 'Designing web interfaces that look flawless on everything from a 4-inch mobile phone to a 4K desktop monitor is an art form. Bootstrap 5 provides a powerful 12-column flexbox grid system that pairs seamlessly with custom CSS Grid rules.\n\nKey responsive strategies:\n- Mobile-First Design: Structure HTML and CSS for small screens first, then progressively enhance layout using breakpoints.\n- CSS Grid for 2D Layouts: While Flexbox excels at 1-dimensional component rows, CSS Grid provides unmatched control over complex 2-dimensional dashboard cards.\n- Fluid Typography and Clamp: Using CSS clamp ensures headline font sizes scale smoothly without jarring breakpoint jumps.\n\nA responsive website creates an inclusive and accessible browsing experience for every user.', 3, 3, '2026-10-05', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80', 26),
(9, 'RESTful API Architecture and Real-Time WebSockets: A Practical Guide', 'Modern web applications rely on clean, predictable communication protocols between the browser and backend servers.\n\nREST API Best Practices:\n- Semantic HTTP Verbs: GET for retrieving, POST for creating, PUT/PATCH for updating, and DELETE for removing resources.\n- Clear Status Codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, and 500 Internal Server Error.\n- Stateless Sessions: Decouple server memory from client state using JSON Web Tokens (JWT) or secure HTTP-only cookies.\n\nWhen real-time updates are needed—such as live chat or notification alerts—WebSockets establish a persistent, bidirectional TCP connection, eliminating wasteful HTTP polling.', 1, 3, '2026-10-05', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', 17),

-- Topic 4: Artificial Intelligence
(10, 'Getting Started with Artificial Intelligence in 2026', 'Artificial intelligence is transforming every corner of computer science. From natural language processing to computer vision, modern machine learning models are empowering developers to build assistive intelligence into everyday software.\n\nFor students starting out at RGUKT RK Valley, the best foundation begins with linear algebra, statistics, Python data libraries (NumPy, Pandas), and understanding ethical AI engineering.', 3, 4, '2026-10-04', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80', 31),
(11, 'Demystifying Large Language Models: Architecture, Attention, and Inference', 'Large Language Models (LLMs) have taken the computing industry by storm. But what happens under the hood when a transformer generates text?\n\nAt the heart of modern LLMs lies the Transformer Architecture introduced in "Attention Is All You Need":\n- Self-Attention Mechanism: Allows the model to weigh the relevance of different words in a sentence regardless of their distance.\n- Feed-Forward Layers & Normalization: Process representations through deep neural layers with residual connections.\n- Tokenization & Embeddings: Raw text is mapped into high-dimensional vector spaces where semantic similarity translates into geometric proximity.\n- Temperature & Top-p Sampling: Control the randomness and creativity during decoding.\n\nUnderstanding these internal mechanics enables engineers to build more accurate prompts, fine-tune domain models, and architect intelligent agent systems.', 1, 4, '2026-10-05', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', 28),
(12, 'Computer Vision in Healthcare: Automated Diagnostics & Medical Imaging', 'One of the most inspiring applications of Artificial Intelligence is in biomedical image analysis. Convolutional Neural Networks (CNNs) and Vision Transformers (ViTs) are assisting doctors by detecting early-stage pathologies with unprecedented accuracy.\n\nImpact areas:\n- Radiology: Automated screening of chest X-rays for pneumonia and tuberculosis.\n- Dermatology: Classification of skin lesions to detect melanoma in early clinical stages.\n- Ophthalmology: Retinal image analysis for diabetic retinopathy detection.\n\nWhile AI models provide powerful decision support, human clinical oversight remains essential. Ethical validation and explainable AI (XAI) are critical for patient safety.', 3, 4, '2026-10-06', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80', 23),

-- Topic 5: Campus Life
(13, 'Top 5 Tips for Excelling in Engineering Semesters', 'Balancing academic projects, lab exams, and coding contests requires deliberate consistency. Here are 5 practical strategies:\n1. Daily 90-minute deep work blocks for data structures.\n2. Document your software requirements early (SRS is key!).\n3. Keep clean Git repositories for every semester lab.\n4. Collaborate actively with peer study groups.\n5. Prioritize sleep and mental well-being before major evaluations.', 1, 5, '2026-10-03', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80', 25),
(14, 'Inside the RGUKT RK Valley Coding Club: Hackathons, Mentorship & Collaboration', 'The Computer Science Department at RGUKT RK Valley boasts a vibrant culture of student-led peer learning and developer clubs. Participating in coding clubs accelerates engineering growth beyond the classroom syllabus.\n\nWhat makes student developer communities impactful:\n- Peer Mentorship: Senior students (E-3 and E-4) mentor juniors in competitive programming, Git, and web technologies.\n- Hackathon Sprints: 24-hour hackathons cultivate rapid prototyping, team communication, and presentation skills under real deadlines.\n- Open Source Contributions: Building useful campus utilities—such as event portals, mess management systems, and academic resource hubs.\n\nGet involved early, ask questions, and build projects you are proud to showcase!', 1, 5, '2026-10-04', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80', 38),
(15, 'Balancing Academics, Sports, and Campus Events: An Undergrad Guide', 'Engineering college life is about holistic growth, not just spending twelve hours a day in front of an IDE. Maintaining physical health and active involvement in sports and cultural fests revitalizes mental energy.\n\nPractical balance tips:\n- The Time-Blocking Method: Dedicate specific hours to coursework, project development, physical exercise, and relaxation.\n- Active Physical Activity: An hour of badminton, volleyball, or gym training relieves stress and boosts cognitive focus.\n- Meaningful Friendships: The bonds formed in campus hostels, late-night canteen discussions, and lab sessions will stay with you for a lifetime.\n\nMake the most of every semester at RGUKT!', 3, 5, '2026-10-05', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80', 20),

-- Topic 6: Career Guidance
(16, 'Cracking On-Campus Tech Placements: The Complete Roadmap for CS Students', 'On-campus placement drives are a milestone for engineering undergraduates. Preparing systematically across E-2 and E-3 semesters dramatically improves placement outcomes.\n\nThe 4-Step Placement Roadmap:\n1. Coding Foundations: Master Arrays, Strings, Linked Lists, Trees, Graphs, and DP on platforms like LeetCode and GeeksforGeeks.\n2. Core CS Subjects: Thoroughly revise Operating Systems (Processes, Threads, Deadlocks), DBMS (SQL queries, Normalization, ACID properties), and Computer Networks.\n3. Impressive Projects: Build 2-3 production-grade full-stack applications with clear architecture, live deployment, and clean GitHub documentation.\n4. Mock Interviews: Practice articulating your problem-solving thought process aloud before the interview panel.', 1, 6, '2026-10-04', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80', 42),
(17, 'How to Build a Standout GitHub Portfolio and Open Source Profile', 'Your GitHub profile is your living resume as a software developer. Recruiters and engineering managers value active code repositories far more than a static PDF.\n\nKey elements of a standout profile:\n- Comprehensive README Files: Every repository should include an architecture overview, screenshots, installation instructions, and tech stack badges.\n- Clean Commit History: Write meaningful commit messages that reflect incremental development rather than a single massive dump.\n- Meaningful Open Source Contributions: Begin by solving "good first issues" in popular open-source projects, improving documentation, or creating bug fixes.\n- Live Deployment Links: Always host your frontend on platforms like Vercel or GitHub Pages and your backend on cloud providers with accessible demo links.', 3, 6, '2026-10-05', 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=800&q=80', 33),
(18, 'Ace the Technical Interview: System Design & Behavioral Preparation', 'Succeeding in technical interviews requires more than just passing unit tests in coding rounds. Senior interviewers evaluate how you design systems and communicate in team environments.\n\nKey preparation areas:\n- System Design Fundamentals: Understand horizontal vs. vertical scaling, database sharding, caching strategies with Redis, and load balancing algorithms.\n- The STAR Method for Behavioral Questions: Structure responses around Situation, Task, Action, and Result when discussing past challenges or leadership roles.\n- Clarifying Requirements: Always ask questions before writing code—clarify input constraints, corner cases, and performance expectations.\n- Positive Attitude: Treat the interview as a collaborative discussion with a fellow engineer.', 1, 6, '2026-10-06', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', 27),
(19, 'ASTRA', '# GPT-6 Astra: A New Generation of AI Intelligence\n\nArtificial intelligence is rapidly moving from simply answering questions to actually helping people complete complex tasks—and GPT-6 Astra represents a major step in that direction.\n\nGPT-6 Astra is OpenAI’s most capable model for demanding reasoning, coding, research, computer use, and professional work. It combines advanced reasoning with the ability to work across browsers, software, files, and multi-step workflows, making it more than just a conversational AI assistant.\n\nOne of Astra’s biggest strengths is its ability to handle **complex tasks from start to finish**. It can help developers understand and fix code, assist researchers with scientific problems, browse information, work with documents and spreadsheets, and interact with computer applications. Its large context window also allows it to work with substantial amounts of information while maintaining the broader context of a task.\n\n### What makes GPT-6 Astra different?\n\nAstra is designed around several important capabilities:\n\n* **Advanced reasoning** – Designed for difficult, multi-step problems.\n* **Software engineering** – Helps write, understand, debug, and improve complex code.\n* **Computer use** – Can interact with websites and computer applications to complete workflows.\n* **Research and browsing** – Can gather and work with information using supported tools.\n* **Professional work** – Can create and work with documents, spreadsheets, presentations, and analyses.\n* **Science and mathematics** – Built to tackle challenging scientific and mathematical problems.\n* **Better instruction following** – Astra is designed to understand changing requirements and maintain the overall goal of a task.\n\nWhat makes this especially interesting is the shift from **“AI that gives you an answer” to “AI that can help get the work done.”** Instead of stopping after generating a piece of code or explaining a concept, Astra can potentially take the next steps—working through tools, applications, and multi-stage workflows.\n\nOf course, powerful AI also comes with significant responsibility. OpenAI highlights stronger safety and alignment measures for Astra, particularly because its capabilities in areas such as computer use and cybersecurity are substantially more advanced.\n\n### The bigger picture\n\nGPT-6 Astra is part of a broader shift in AI toward systems that can reason, use tools, understand context, and collaborate with humans on real-world tasks. Its significance is not simply that it can produce better answers—it is that AI is increasingly becoming capable of participating in the process of **researching, creating, analyzing, coding, and executing work**.\n\nFor students, developers, researchers, and professionals, this could change how we approach everyday tasks. The future of AI may not be about replacing human creativity and decision-making, but about giving people increasingly capable tools to explore ideas and accomplish more.\n\n**GPT-6 Astra points toward that future: AI that doesn\'t just respond—it reasons, works, and helps turn ideas into results.**', 1, 4, '2026-10-06', 'uploads/upload_3e9a2cc7340d.png', 0);

-- Comments (Sample initial comments)
INSERT INTO `comments` (`comment_id`, `post_id`, `user_id`, `content`, `date`) VALUES
(1, 1, 3, 'Great breakdown of serverless vs containers! This clarifies cloud architecture so well.', '2026-10-01 16:45'),
(2, 4, 2, 'AsyncIO and typing make a huge difference in code maintainability. Super informative post.', '2026-10-02 18:20'),
(3, 7, 3, 'Bootstrap 5 grid makes responsiveness so seamless. Clean setup!', '2026-10-04 14:30'),
(4, 7, 2, 'Very well structured post. Keep up the high standard.', '2026-10-04 16:15'),
(5, 10, 1, 'Completely agree. Strong fundamentals in linear algebra and python make AI concepts much easier.', '2026-10-05 10:20'),
(6, 16, 3, 'This roadmap is gold for E-3 students preparing for campus placements! Thank you Jaswanth.', '2026-10-04 20:10');

-- Post Likes
INSERT IGNORE INTO `post_likes` (`post_id`, `user_id`) VALUES
(1, 2), (1, 3),
(2, 1),
(3, 2),
(4, 2), (4, 3),
(5, 1),
(6, 2),
(7, 2), (7, 3),
(8, 1),
(9, 2),
(10, 1), (10, 2),
(11, 3),
(12, 1),
(13, 2),
(14, 2), (14, 3),
(15, 1),
(16, 2), (16, 3),
(17, 1),
(18, 2);
