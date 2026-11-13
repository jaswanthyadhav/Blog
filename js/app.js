/**
 * ============================================================================
 * BLOG WEBSITE - Client-Side Application Core (JavaScript)
 * RGUKT RK VALLEY - Department of Computer Science
 * Project: SOFTWARE REQUIREMENT SPECIFICATIONS - BLOG WEBSITE
 * Author: P Jaswanth (Roll No. R220601)
 * Faculty Guide: Lingamurthy Sir
 *
 * Implements SRS Use Cases:
 *  - UC-01: Register Account
 *  - UC-02: Log In & Session Management
 *  - UC-03: Manage Profile
 *  - UC-04: Create Blog Post
 *  - UC-05: Edit Blog Post
 *  - UC-06: Delete Blog Post
 *  - UC-07: View Blog Post & Details
 *  - UC-08: Search & Browse Posts (by keyword, category)
 *  - UC-09: Add Image to Post (File Reader & API Upload)
 *  - UC-10: Post a Comment
 *  - UC-11: Like a Post (Like / Unlike)
 *  - UC-12: Administrator Management (Users, Posts, Comments)
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Default Seed Data (18 Posts across all 6 SRS Categories)
  // --------------------------------------------------------------------------
  const SEED_USERS = [
    {
      id: 1,
      name: 'Jaswanth P',
      email: 'r220601@rguktrkv.ac.in',
      password: 'password123',
      role: 'author',
      bio: 'Computer Science undergraduate at RGUKT RK Valley (E-3 Sem-1, R220601). Passionate about web development and algorithms.',
      joined: 'September 2026'
    },
    {
      id: 2,
      name: 'System Admin',
      email: 'admin@blog.com',
      password: 'admin123',
      role: 'admin',
      bio: 'Platform Administrator for RGUKT Blog Website.',
      joined: 'August 2026'
    },
    {
      id: 3,
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      password: 'user123',
      role: 'author',
      bio: 'Tech enthusiast and open source contributor at RGUKT RK Valley.',
      joined: 'October 2026'
    }
  ];

  const SEED_CATEGORIES = [
    'Technology',
    'Programming',
    'Web Development',
    'Artificial Intelligence',
    'Campus Life',
    'Career Guidance'
  ];

  const SEED_POSTS = [
    // ------------------ 1. TECHNOLOGY ------------------
    {
      id: 1,
      title: 'The Evolution of Cloud Computing: From Monoliths to Serverless Architectures',
      category: 'Technology',
      authorId: 1,
      authorName: 'Jaswanth P',
      date: '2026-10-01',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      likes: 18,
      likedBy: [2, 3],
      content: `Cloud computing has revolutionized modern software engineering. In the early days, applications were built as giant monoliths deployed on expensive bare-metal servers. Today, cloud-native architectures, containerization with Docker and Kubernetes, and serverless compute paradigms have transformed how systems scale.

Key architectural transitions:
1. Virtual Machines to Container Orchestration: Microservices allow modular deployment and independent scaling.
2. Serverless Execution: Event-driven functions (like AWS Lambda and Google Cloud Functions) execute only when triggered, minimizing idle costs.
3. Edge Computing: Computing resources are pushed closer to end users, slashing latency for IoT and real-time platforms.

For RGUKT students, understanding cloud primitives is no longer optional—it is the foundational fabric of enterprise software.`
    },
    {
      id: 2,
      title: 'Next-Gen Cybersecurity: Implementing Zero Trust in Distributed Systems',
      category: 'Technology',
      authorId: 3,
      authorName: 'Ananya Sharma',
      date: '2026-10-02',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
      likes: 22,
      likedBy: [1],
      content: `The traditional cybersecurity perimeter is obsolete. In an era of hybrid work, decentralized teams, and cloud hosting, the "castle-and-moat" security model has given way to Zero Trust Architecture (ZTA).

The core philosophy of Zero Trust is simple: "Never Trust, Always Verify."

Core implementation pillars:
- Strict Identity Verification: Multi-Factor Authentication (MFA) and granular Role-Based Access Control (RBAC).
- Least Privilege Access: Granting users and services only the bare minimum permissions needed to perform their tasks.
- Continuous Monitoring & Telemetry: Auditing access tokens, anomalous login behaviors, and encrypted network flows in real time.

Protecting student and enterprise data demands security by design, starting from the application layer up to database access controls.`
    },
    {
      id: 3,
      title: 'Quantum Computing in 2026: Practical Realities vs. Theoretical Hype',
      category: 'Technology',
      authorId: 1,
      authorName: 'Jaswanth P',
      date: '2026-10-03',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
      likes: 15,
      likedBy: [2],
      content: `Quantum computing has captured headlines with promises of instant cryptographic cracking and revolutionary molecular simulations. But where does the technology stand in 2026?

Current status:
- NISQ Era (Noisy Intermediate-Scale Quantum): Today's quantum processors operate with hundreds of physical qubits, but quantum error correction remains the grand engineering challenge.
- Quantum Advantage: Achieved for specialized mathematical benchmark problems, while general-purpose quantum advantage is steadily progressing.
- Post-Quantum Cryptography (PQC): The transition to quantum-resistant encryption algorithms (like lattice-based cryptography) has already begun across global tech giants.

Exploring quantum computing algorithms with frameworks like Qiskit offers computer science undergraduates a fascinating window into the future of computation.`
    },

    // ------------------ 2. PROGRAMMING ------------------
    {
      id: 4,
      title: 'Mastering Python 3.11+ Performance: AsyncIO, Typing, and Optimization',
      category: 'Programming',
      authorId: 1,
      authorName: 'Jaswanth P',
      date: '2026-10-02',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      likes: 29,
      likedBy: [2, 3],
      content: `Python continues to be one of the most beloved languages in the world. With recent releases (Python 3.11 and beyond), the Faster CPython initiative has delivered massive performance gains through adaptive bytecode specialization and inlined function calls.

How to write high-performance Python:
- Harness AsyncIO for I/O Bound Tasks: Utilize asynchronous event loops when querying APIs, fetching network data, or performing concurrent database lookups.
- Strong Static Typing with Mypy: Type annotations (typing) improve code clarity, catch runtime bugs early, and help modern IDEs provide intelligent autocompletion.
- Memory Optimization: Using __slots__, generators (yield), and built-in collections like deque and namedtuple dramatically reduces overhead in large data sets.

Clean code combined with modern Python tooling unlocks both rapid prototyping and production-grade speed.`
    },
    {
      id: 5,
      title: 'Data Structures & Algorithms in Competitive Programming: From Graphs to DP',
      category: 'Programming',
      authorId: 3,
      authorName: 'Ananya Sharma',
      date: '2026-10-03',
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
      likes: 34,
      likedBy: [1],
      content: `Competitive programming is the ultimate arena for honing analytical problem-solving and algorithmic efficiency. Whether preparing for Google Code Jam, LeetCode contests, or campus placement rounds, mastering core patterns is essential.

Key algorithmic pillars:
1. Graph Traversals: BFS for shortest paths in unweighted graphs, DFS for topological sorting, and Dijkstra's algorithm for weighted graphs.
2. Dynamic Programming (DP): Identifying overlapping subproblems and optimal substructure. Transitioning from memoization (top-down) to tabulation (bottom-up).
3. Disjoint Set Union (DSU) & Segment Trees: Indispensable for range queries and dynamic connectivity.

Consistency is key: solve two problems every day, analyze time and space complexity rigorously, and never skip post-contest editorials!`
    },
    {
      id: 6,
      title: 'Clean Architecture & SOLID Principles: Writing Maintainable Software',
      category: 'Programming',
      authorId: 1,
      authorName: 'Jaswanth P',
      date: '2026-10-04',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      likes: 21,
      likedBy: [2],
      content: `Anyone can write code that a computer understands; good programmers write code that humans can understand and maintain. The SOLID principles provide timeless rules for writing robust object-oriented software:

- S (Single Responsibility): Every class or module should have one, and only one, reason to change.
- O (Open/Closed): Software entities should be open for extension, but closed for modification.
- L (Liskov Substitution): Subtypes must be substitutable for their base types without altering correctness.
- I (Interface Segregation): Clients should not be forced to depend on methods they do not use.
- D (Dependency Inversion): High-level modules should depend on abstractions, not concrete implementations.

Applying these principles transforms tangled spaghetti code into an elegant, testable, and modular system.`
    },

    // ------------------ 3. WEB DEVELOPMENT ------------------
    {
      id: 7,
      title: 'Building Modern Web Applications with Flask & Bootstrap',
      category: 'Web Development',
      authorId: 1,
      authorName: 'Jaswanth P',
      date: '2026-10-04',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
      likes: 19,
      likedBy: [2, 3],
      content: `Web development has evolved dramatically over the last few years. By combining Python's lightweight and flexible Flask framework with Bootstrap's responsive utility classes, developers can quickly bootstrap full-featured applications.

In this guide, we break down:
1. Setting up virtual environments and Flask blueprints.
2. Structuring clean Jinja2 templates and modular CSS.
3. Managing state smoothly between REST APIs and modern client interfaces.

Clean code and responsive layout guarantee great user experience on both desktops and mobile devices!`
    },
    {
      id: 8,
      title: 'Mastering Responsive Layouts with Bootstrap 5 & Modern CSS Grid',
      category: 'Web Development',
      authorId: 3,
      authorName: 'Ananya Sharma',
      date: '2026-10-05',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      likes: 26,
      likedBy: [1],
      content: `Designing web interfaces that look flawless on everything from a 4-inch mobile phone to a 4K desktop monitor is an art form. Bootstrap 5 provides a powerful 12-column flexbox grid system that pairs seamlessly with custom CSS Grid rules.

Key responsive strategies:
- Mobile-First Design: Structure HTML and CSS for small screens first, then progressively enhance layout using breakpoints.
- CSS Grid for 2D Layouts: While Flexbox excels at 1-dimensional component rows, CSS Grid provides unmatched control over complex 2-dimensional dashboard cards.
- Fluid Typography and Clamp: Using CSS clamp ensures headline font sizes scale smoothly without jarring breakpoint jumps.

A responsive website creates an inclusive and accessible browsing experience for every user.`
    },
    {
      id: 9,
      title: 'RESTful API Architecture and Real-Time WebSockets: A Practical Guide',
      category: 'Web Development',
      authorId: 1,
      authorName: 'Jaswanth P',
      date: '2026-10-05',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      likes: 17,
      likedBy: [2],
      content: `Modern web applications rely on clean, predictable communication protocols between the browser and backend servers.

REST API Best Practices:
- Semantic HTTP Verbs: GET for retrieving, POST for creating, PUT/PATCH for updating, and DELETE for removing resources.
- Clear Status Codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, and 500 Internal Server Error.
- Stateless Sessions: Decouple server memory from client state using JSON Web Tokens (JWT) or secure HTTP-only cookies.

When real-time updates are needed—such as live chat or notification alerts—WebSockets establish a persistent, bidirectional TCP connection, eliminating wasteful HTTP polling.`
    },

    // ------------------ 4. ARTIFICIAL INTELLIGENCE ------------------
    {
      id: 10,
      title: 'Getting Started with Artificial Intelligence in 2026',
      category: 'Artificial Intelligence',
      authorId: 3,
      authorName: 'Ananya Sharma',
      date: '2026-10-04',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
      likes: 31,
      likedBy: [1, 2],
      content: `Artificial intelligence is transforming every corner of computer science. From natural language processing to computer vision, modern machine learning models are empowering developers to build assistive intelligence into everyday software.

For students starting out at RGUKT RK Valley, the best foundation begins with linear algebra, statistics, Python data libraries (NumPy, Pandas), and understanding ethical AI engineering.`
    },
    {
      id: 11,
      title: 'Demystifying Large Language Models: Architecture, Attention, and Inference',
      category: 'Artificial Intelligence',
      authorId: 1,
      authorName: 'Jaswanth P',
      date: '2026-10-05',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      likes: 28,
      likedBy: [3],
      content: `Large Language Models (LLMs) have taken the computing industry by storm. But what happens under the hood when a transformer generates text?

At the heart of modern LLMs lies the Transformer Architecture introduced in "Attention Is All You Need":
- Self-Attention Mechanism: Allows the model to weigh the relevance of different words in a sentence regardless of their distance.
- Feed-Forward Layers & Normalization: Process representations through deep neural layers with residual connections.
- Tokenization & Embeddings: Raw text is mapped into high-dimensional vector spaces where semantic similarity translates into geometric proximity.
- Temperature & Top-p Sampling: Control the randomness and creativity during decoding.

Understanding these internal mechanics enables engineers to build more accurate prompts, fine-tune domain models, and architect intelligent agent systems.`
    },
    {
      id: 12,
      title: 'Computer Vision in Healthcare: Automated Diagnostics & Medical Imaging',
      category: 'Artificial Intelligence',
      authorId: 3,
      authorName: 'Ananya Sharma',
      date: '2026-10-06',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      likes: 23,
      likedBy: [1],
      content: `One of the most inspiring applications of Artificial Intelligence is in biomedical image analysis. Convolutional Neural Networks (CNNs) and Vision Transformers (ViTs) are assisting doctors by detecting early-stage pathologies with unprecedented accuracy.

Impact areas:
- Radiology: Automated screening of chest X-rays for pneumonia and tuberculosis.
- Dermatology: Classification of skin lesions to detect melanoma in early clinical stages.
- Ophthalmology: Retinal image analysis for diabetic retinopathy detection.

While AI models provide powerful decision support, human clinical oversight remains essential. Ethical validation and explainable AI (XAI) are critical for patient safety.`
    },

    // ------------------ 5. CAMPUS LIFE ------------------
    {
      id: 13,
      title: 'Top 5 Tips for Excelling in Engineering Semesters',
      category: 'Campus Life',
      authorId: 1,
      authorName: 'Jaswanth P',
      date: '2026-10-03',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      likes: 25,
      likedBy: [2],
      content: `Balancing academic projects, lab exams, and coding contests requires deliberate consistency. Here are 5 practical strategies:
1. Daily 90-minute deep work blocks for data structures.
2. Document your software requirements early (SRS is key!).
3. Keep clean Git repositories for every semester lab.
4. Collaborate actively with peer study groups.
5. Prioritize sleep and mental well-being before major evaluations.`
    },
    {
      id: 14,
      title: 'Inside the RGUKT RK Valley Coding Club: Hackathons, Mentorship & Collaboration',
      category: 'Campus Life',
      authorId: 1,
      authorName: 'Jaswanth P',
      date: '2026-10-04',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      likes: 38,
      likedBy: [2, 3],
      content: `The Computer Science Department at RGUKT RK Valley boasts a vibrant culture of student-led peer learning and developer clubs. Participating in coding clubs accelerates engineering growth beyond the classroom syllabus.

What makes student developer communities impactful:
- Peer Mentorship: Senior students (E-3 and E-4) mentor juniors in competitive programming, Git, and web technologies.
- Hackathon Sprints: 24-hour hackathons cultivate rapid prototyping, team communication, and presentation skills under real deadlines.
- Open Source Contributions: Building useful campus utilities—such as event portals, mess management systems, and academic resource hubs.

Get involved early, ask questions, and build projects you are proud to showcase!`
    },
    {
      id: 15,
      title: 'Balancing Academics, Sports, and Campus Events: An Undergrad Guide',
      category: 'Campus Life',
      authorId: 3,
      authorName: 'Ananya Sharma',
      date: '2026-10-05',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      likes: 20,
      likedBy: [1],
      content: `Engineering college life is about holistic growth, not just spending twelve hours a day in front of an IDE. Maintaining physical health and active involvement in sports and cultural fests revitalizes mental energy.

Practical balance tips:
- The Time-Blocking Method: Dedicate specific hours to coursework, project development, physical exercise, and relaxation.
- Active Physical Activity: An hour of badminton, volleyball, or gym training relieves stress and boosts cognitive focus.
- Meaningful Friendships: The bonds formed in campus hostels, late-night canteen discussions, and lab sessions will stay with you for a lifetime.

Make the most of every semester at RGUKT!`
    },

    // ------------------ 6. CAREER GUIDANCE ------------------
    {
      id: 16,
      title: 'Cracking On-Campus Tech Placements: The Complete Roadmap for CS Students',
      category: 'Career Guidance',
      authorId: 1,
      authorName: 'Jaswanth P',
      date: '2026-10-04',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      likes: 42,
      likedBy: [2, 3],
      content: `On-campus placement drives are a milestone for engineering undergraduates. Preparing systematically across E-2 and E-3 semesters dramatically improves placement outcomes.

The 4-Step Placement Roadmap:
1. Coding Foundations: Master Arrays, Strings, Linked Lists, Trees, Graphs, and DP on platforms like LeetCode and GeeksforGeeks.
2. Core CS Subjects: Thoroughly revise Operating Systems (Processes, Threads, Deadlocks), DBMS (SQL queries, Normalization, ACID properties), and Computer Networks.
3. Impressive Projects: Build 2-3 production-grade full-stack applications with clear architecture, live deployment, and clean GitHub documentation.
4. Mock Interviews: Practice articulating your problem-solving thought process aloud before the interview panel.`
    },
    {
      id: 17,
      title: 'How to Build a Standout GitHub Portfolio and Open Source Profile',
      category: 'Career Guidance',
      authorId: 3,
      authorName: 'Ananya Sharma',
      date: '2026-10-05',
      image: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=800&q=80',
      likes: 33,
      likedBy: [1],
      content: `Your GitHub profile is your living resume as a software developer. Recruiters and engineering managers value active code repositories far more than a static PDF.

Key elements of a standout profile:
- Comprehensive README Files: Every repository should include an architecture overview, screenshots, installation instructions, and tech stack badges.
- Clean Commit History: Write meaningful commit messages that reflect incremental development rather than a single massive dump.
- Meaningful Open Source Contributions: Begin by solving "good first issues" in popular open-source projects, improving documentation, or creating bug fixes.
- Live Deployment Links: Always host your frontend on platforms like Vercel or GitHub Pages and your backend on cloud providers with accessible demo links.`
    },
    {
      id: 18,
      title: 'Ace the Technical Interview: System Design & Behavioral Preparation',
      category: 'Career Guidance',
      authorId: 1,
      authorName: 'Jaswanth P',
      date: '2026-10-06',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      likes: 27,
      likedBy: [2],
      content: `Succeeding in technical interviews requires more than just passing unit tests in coding rounds. Senior interviewers evaluate how you design systems and communicate in team environments.

Key preparation areas:
- System Design Fundamentals: Understand horizontal vs. vertical scaling, database sharding, caching strategies with Redis, and load balancing algorithms.
- The STAR Method for Behavioral Questions: Structure responses around Situation, Task, Action, and Result when discussing past challenges or leadership roles.
- Clarifying Requirements: Always ask questions before writing code—clarify input constraints, corner cases, and performance expectations.
- Positive Attitude: Treat the interview as a collaborative discussion with a fellow engineer.`
    },
    // ------------------ 7. ASTRA (AI) ------------------
    {
      id: 19,
      title: 'ASTRA',
      category: 'Artificial Intelligence',
      authorId: 1,
      authorName: 'Jaswanth P',
      date: '2026-10-06',
      image: 'uploads/upload_3e9a2cc7340d.png',
      likes: 5,
      likedBy: [2],
      content: `# GPT-6 Astra: A New Generation of AI Intelligence

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

**GPT-6 Astra points toward that future: AI that doesn't just respond—it reasons, works, and helps turn ideas into results.**`
    }
  ];

  const SEED_COMMENTS = [
    {
      id: 1,
      postId: 1,
      userId: 3,
      userName: 'Ananya Sharma',
      content: 'Great breakdown of serverless vs containers! This clarifies cloud architecture so well.',
      date: '2026-10-01 16:45'
    },
    {
      id: 2,
      postId: 4,
      userId: 2,
      userName: 'System Admin',
      content: 'AsyncIO and typing make a huge difference in code maintainability. Super informative post.',
      date: '2026-10-02 18:20'
    },
    {
      id: 3,
      postId: 7,
      userId: 3,
      userName: 'Ananya Sharma',
      content: 'Bootstrap 5 grid makes responsiveness so seamless. Clean setup!',
      date: '2026-10-04 14:30'
    },
    {
      id: 4,
      postId: 7,
      userId: 2,
      userName: 'System Admin',
      content: 'Very well structured post. Keep up the high standard.',
      date: '2026-10-04 16:15'
    },
    {
      id: 5,
      postId: 10,
      userId: 1,
      userName: 'Jaswanth P',
      content: 'Completely agree. Strong fundamentals in linear algebra and python make AI concepts much easier.',
      date: '2026-10-05 10:20'
    },
    {
      id: 6,
      postId: 16,
      userId: 3,
      userName: 'Ananya Sharma',
      content: 'This roadmap is gold for E-3 students preparing for campus placements! Thank you Jaswanth.',
      date: '2026-10-04 20:10'
    }
  ];

  // --------------------------------------------------------------------------
  // Application State & Storage
  // --------------------------------------------------------------------------
  const AppState = {
    users: [],
    posts: [],
    comments: [],
    categories: [],
    currentUser: null,
    activeCategory: 'All',
    searchQuery: '',
    currentViewingPostId: null,
    editingPostId: null,
    activeView: 'home',
    isBackendOnline: false,
    backendInfo: null,
    apiBase: '' // Auto-detected: relative or 'http://127.0.0.1:5000'
  };

  // --------------------------------------------------------------------------
  // Backend API Client & Dual Mode Synchronization
  // --------------------------------------------------------------------------
  async function checkBackendConnection() {
    // Check if relative /api/status or http://127.0.0.1:5000/api/status works
    const testUrls = ['/api/status', 'http://127.0.0.1:5000/api/status'];
    for (const url of testUrls) {
      try {
        const resp = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
        if (resp.ok) {
          const data = await resp.json();
          AppState.isBackendOnline = true;
          AppState.backendInfo = data;
          AppState.apiBase = url.replace('/api/status', '');
          updateBackendIndicator(true, data);
          return true;
        }
      } catch (err) {
        // try next
      }
    }
    AppState.isBackendOnline = false;
    AppState.backendInfo = null;
    updateBackendIndicator(false);
    return false;
  }

  function updateBackendIndicator(online, data = null) {
    const pill = document.getElementById('backendStatusPill');
    const text = document.getElementById('backendStatusText');
    if (!pill || !text) return;

    if (online && data) {
      const engine = data.database?.engine || 'MySQL';
      pill.className = 'badge bg-success text-white py-1 px-2 d-flex align-items-center gap-1 shadow-sm';
      text.innerHTML = `<i class="bi bi-hdd-network-fill me-1"></i> Backend: Flask | DB: ${engine}`;
      pill.title = `Connected to Python Flask & ${engine}. Click for details.`;
    } else {
      pill.className = 'badge bg-secondary text-white py-1 px-2 d-flex align-items-center gap-1 shadow-sm';
      text.innerHTML = `<i class="bi bi-laptop me-1"></i> Standalone Mode (localStorage)`;
      pill.title = 'Running locally without Flask. Click for setup instructions.';
    }
  }

  async function apiRequest(endpoint, options = {}) {
    if (!AppState.isBackendOnline) return null;
    try {
      const url = `${AppState.apiBase}${endpoint}`;
      const res = await fetch(url, options);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend request failed:', endpoint, e);
    }
    return null;
  }

  // Sync state from Backend or localStorage
  async function syncData() {
    const online = await checkBackendConnection();
    if (online) {
      try {
        const [postsData, catsData] = await Promise.all([
          apiRequest('/api/posts'),
          apiRequest('/api/categories')
        ]);
        if (postsData && Array.isArray(postsData)) {
          AppState.posts = postsData;
        }
        if (catsData && Array.isArray(catsData)) {
          AppState.categories = catsData;
        }
        renderBlogPosts();
        renderCategoryPills();
      } catch (e) {
        console.error('Error syncing from backend:', e);
      }
    }
  }

  function initStorage() {
    // Seed localStorage if empty or outdated (update if fewer than 19 posts)
    const storedPosts = localStorage.getItem('blog_posts');
    const existingPostsList = storedPosts ? JSON.parse(storedPosts) : [];

    if (!storedPosts || existingPostsList.length < SEED_POSTS.length) {
      localStorage.setItem('blog_posts', JSON.stringify(SEED_POSTS));
    }
    if (!localStorage.getItem('blog_users')) {
      localStorage.setItem('blog_users', JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem('blog_comments') || JSON.parse(localStorage.getItem('blog_comments')).length < SEED_COMMENTS.length) {
      localStorage.setItem('blog_comments', JSON.stringify(SEED_COMMENTS));
    }
    if (!localStorage.getItem('blog_categories')) {
      localStorage.setItem('blog_categories', JSON.stringify(SEED_CATEGORIES));
    }

    AppState.users = JSON.parse(localStorage.getItem('blog_users'));
    AppState.posts = JSON.parse(localStorage.getItem('blog_posts')) || [];
    AppState.comments = JSON.parse(localStorage.getItem('blog_comments'));
    AppState.categories = JSON.parse(localStorage.getItem('blog_categories'));

    // Auto-repair & normalize image paths in localStorage
    let postsChanged = false;
    AppState.posts.forEach(p => {
      if ((p.title && p.title.toUpperCase().includes('ASTRA')) || p.id === 19) {
        if (!p.image || p.image.includes('photo-1499750310107-5fef28a66643') || p.image === '/uploads/upload_3e9a2cc7340d.png') {
          p.image = 'uploads/upload_3e9a2cc7340d.png';
          postsChanged = true;
        }
      }
      if (p.image && typeof p.image === 'string' && p.image.startsWith('/uploads/')) {
        p.image = p.image.substring(1);
        postsChanged = true;
      }
    });

    // Ensure ASTRA post exists
    if (!AppState.posts.some(p => p.id === 19 || (p.title && p.title.toUpperCase() === 'ASTRA'))) {
      const astraSeed = SEED_POSTS.find(p => p.id === 19);
      if (astraSeed) {
        AppState.posts.unshift(astraSeed);
        postsChanged = true;
      }
    }

    if (postsChanged) {
      localStorage.setItem('blog_posts', JSON.stringify(AppState.posts));
    }

    const storedUser = localStorage.getItem('blog_current_user');
    if (storedUser) {
      AppState.currentUser = JSON.parse(storedUser);
    } else {
      AppState.currentUser = null;
    }
  }

  function saveState() {
    localStorage.setItem('blog_users', JSON.stringify(AppState.users));
    localStorage.setItem('blog_posts', JSON.stringify(AppState.posts));
    localStorage.setItem('blog_comments', JSON.stringify(AppState.comments));
    localStorage.setItem('blog_categories', JSON.stringify(AppState.categories));
    if (AppState.currentUser) {
      localStorage.setItem('blog_current_user', JSON.stringify(AppState.currentUser));
    } else {
      localStorage.removeItem('blog_current_user');
    }
  }

  // --------------------------------------------------------------------------
  // UI Helpers & Toast Notifications
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const bgClass = type === 'success' ? 'bg-success text-white' :
                    type === 'error' ? 'bg-danger text-white' :
                    type === 'warning' ? 'bg-warning text-dark' : 'bg-primary text-white';

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center ${bgClass} border-0 shadow`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body fw-semibold">
          <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'} me-2"></i>
          ${escapeHtml(message)}
        </div>
        <button type="button" class="btn-close ${type === 'warning' ? '' : 'btn-close-white'} me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    toastContainer.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl, { delay: 3500 });
    toast.show();

    toastEl.addEventListener('hidden.bs.toast', () => {
      toastEl.remove();
    });
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  function resolveImageUrl(imgUrl) {
    if (!imgUrl) {
      return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';
    }
    if (imgUrl.startsWith('data:') || imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
      return imgUrl;
    }
    // Clean leading slash for local upload paths so relative loading works on file://, Live Server, and Flask
    const cleanPath = imgUrl.startsWith('/') ? imgUrl.substring(1) : imgUrl;
    if (AppState.isBackendOnline && AppState.apiBase && typeof window !== 'undefined' && window.location && window.location.origin) {
      const isSameOrigin = window.location.href.startsWith(AppState.apiBase);
      if (!isSameOrigin && !window.location.protocol.startsWith('file')) {
        return `${AppState.apiBase}/${cleanPath}`;
      }
    }
    return cleanPath;
  }

  window.handlePostImgError = function(imgEl, originalPath) {
    if (!imgEl || imgEl.dataset.fallbackTried === 'done') {
      if (imgEl) imgEl.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';
      return;
    }
    const step = parseInt(imgEl.dataset.fallbackStep || '0', 10);
    imgEl.dataset.fallbackStep = String(step + 1);

    if (step === 0 && originalPath) {
      if (originalPath.startsWith('/')) {
        imgEl.src = originalPath.substring(1);
        return;
      } else {
        imgEl.src = '/' + originalPath;
        return;
      }
    } else if (step === 1 && originalPath) {
      const clean = originalPath.startsWith('/') ? originalPath.substring(1) : originalPath;
      if (AppState.apiBase) {
        imgEl.src = `${AppState.apiBase}/${clean}`;
        return;
      }
      imgEl.src = `http://127.0.0.1:5000/${clean}`;
      return;
    }

    imgEl.dataset.fallbackTried = 'done';
    imgEl.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';
  };

  // --------------------------------------------------------------------------
  // Authentication & Session Management (UC-01, UC-02)
  // --------------------------------------------------------------------------
  async function registerUser(name, email, password, role = 'author') {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const safeRole = role === 'admin' ? 'author' : (role || 'author');

    if (!cleanName || !cleanEmail || !password) {
      showToast('All fields are required for registration.', 'error');
      return false;
    }

    // Attempt backend registration
    if (AppState.isBackendOnline) {
      try {
        const res = await fetch(`${AppState.apiBase}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: cleanName, email: cleanEmail, password, role: safeRole })
        });
        const data = await res.json();
        if (res.ok && data.user) {
          AppState.currentUser = data.user;
          saveState();
          updateAuthUI();
          showToast(`Welcome ${data.user.name}! Registered to ${AppState.backendInfo?.database?.engine || 'Database'}.`, 'success');
          return true;
        } else {
          showToast(data.error || 'Registration failed.', 'error');
          return false;
        }
      } catch (e) {
        console.warn('Backend reg error, falling back to local:', e);
      }
    }

    // Local fallback
    const emailExists = AppState.users.some(u => u.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      showToast('An account with this email already exists. Please log in.', 'error');
      return false;
    }

    const newUser = {
      id: Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: password,
      role: safeRole,
      bio: 'New member of RGUKT Blog community.',
      joined: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    AppState.users.push(newUser);
    AppState.currentUser = newUser;
    saveState();
    updateAuthUI();
    showToast(`Welcome ${newUser.name}! Your account has been registered.`, 'success');
    return true;
  }

  async function loginUser(email, password) {
    const cleanEmail = email.trim().toLowerCase();

    // Attempt backend login
    if (AppState.isBackendOnline) {
      try {
        const res = await fetch(`${AppState.apiBase}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password })
        });
        const data = await res.json();
        if (res.ok && data.user) {
          AppState.currentUser = data.user;
          saveState();
          updateAuthUI();
          showToast(`Welcome back, ${data.user.name}! Authenticated with Backend.`, 'success');
          return true;
        } else {
          showToast(data.error || 'Invalid credentials.', 'error');
          return false;
        }
      } catch (e) {
        console.warn('Backend login error, falling back to local:', e);
      }
    }

    // Local fallback
    const user = AppState.users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
    if (!user) {
      showToast('Invalid email or password. Please try again.', 'error');
      return false;
    }

    AppState.currentUser = user;
    saveState();
    updateAuthUI();
    showToast(`Welcome back, ${user.name}!`, 'success');
    return true;
  }

  function logoutUser() {
    AppState.currentUser = null;
    saveState();
    updateAuthUI();
    navigateTo('home');
    showToast('You have been logged out successfully.', 'info');
  }

  function quickSwitchRole(role) {
    if (role === 'visitor') {
      if (!AppState.currentUser) {
        showToast('You are already in Visitor mode (Guest).', 'info');
        return;
      }
      AppState.currentUser = null;
      saveState();
      updateAuthUI();
      navigateTo('home');
      showToast('Switched to Visitor mode (read-only guest view).', 'info');
      return;
    }

    // If currently in visitor mode: REQUIRE LOGIN to switch to author or admin!
    if (!AppState.currentUser) {
      if (role === 'author') {
        showToast('Visitor mode active. Please log in with Author credentials.', 'warning');
        openLoginModal('Visitor Mode Active: Please sign in with Author credentials to create and manage blog posts.');
      } else if (role === 'admin') {
        showToast('Visitor mode active. Please log in with Administrator credentials.', 'warning');
        openLoginModal('Visitor Mode Active: Please sign in with Administrator credentials to access the Admin Dashboard.');
      }
      return;
    }

    // If already logged in:
    if (role === 'author') {
      if (AppState.currentUser.role === 'author') {
        showToast(`You are already logged in as Author (${AppState.currentUser.name}).`, 'info');
        navigateTo('home');
      } else {
        showToast('Please log in with Author credentials to switch role.', 'warning');
        openLoginModal('Please log in with Author credentials to switch to the Author role.');
      }
    } else if (role === 'admin') {
      if (AppState.currentUser.role === 'admin') {
        showToast(`You are already logged in as Administrator (${AppState.currentUser.name}).`, 'info');
        navigateTo('admin');
      } else {
        showToast('Administrator privileges required. Please log in as Admin.', 'warning');
        openLoginModal('Administrator Privileges Required: Please sign in with administrator credentials to access the Admin Dashboard.');
      }
    }
  }

  // --------------------------------------------------------------------------
  // Navigation & View Rendering
  // --------------------------------------------------------------------------
  function navigateTo(viewName, param = null) {
    AppState.activeView = viewName;

    const homeView = document.getElementById('homeView');
    const postDetailView = document.getElementById('postDetailView');
    const profileView = document.getElementById('profileView');
    const adminView = document.getElementById('adminView');

    [homeView, postDetailView, profileView, adminView].forEach(v => {
      if (v) v.classList.add('d-none');
    });

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

    if (viewName === 'home') {
      if (homeView) homeView.classList.remove('d-none');
      const homeLink = document.getElementById('navLinkHome');
      if (homeLink) homeLink.classList.add('active');
      renderCategoryPills();
      renderBlogPosts();
    } else if (viewName === 'post-detail') {
      AppState.currentViewingPostId = param;
      if (postDetailView) postDetailView.classList.remove('d-none');
      renderPostDetail(param);
    } else if (viewName === 'profile') {
      if (!AppState.currentUser) {
        showToast('Please log in to manage your profile.', 'warning');
        openLoginModal();
        navigateTo('home');
        return;
      }
      if (profileView) profileView.classList.remove('d-none');
      const dashboardLink = document.getElementById('navLinkDashboard');
      if (dashboardLink) dashboardLink.classList.add('active');
      renderProfileView();
    } else if (viewName === 'admin') {
      if (!AppState.currentUser || AppState.currentUser.role !== 'admin') {
        showToast('Access denied: Administrator privileges required.', 'error');
        navigateTo('home');
        return;
      }
      if (adminView) adminView.classList.remove('d-none');
      const adminLink = document.getElementById('navLinkAdmin');
      if (adminLink) adminLink.classList.add('active');
      renderAdminDashboard();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --------------------------------------------------------------------------
  // Auth UI Updates (Header, Buttons, Profile dropdown)
  // --------------------------------------------------------------------------
  function updateAuthUI() {
    const authActionsVisitor = document.getElementById('authActionsVisitor');
    const authActionsUser = document.getElementById('authActionsUser');
    const navWritePostBtn = document.getElementById('navWritePostBtn');
    const navLinkDashboard = document.getElementById('navLinkDashboard');
    const navLinkAdmin = document.getElementById('navLinkAdmin');
    const userDisplayName = document.getElementById('userDisplayName');
    const userRoleBadge = document.getElementById('userRoleBadge');
    const activeRoleText = document.getElementById('activeRoleText');

    if (AppState.currentUser) {
      if (authActionsVisitor) authActionsVisitor.classList.add('d-none');
      if (authActionsUser) authActionsUser.classList.remove('d-none');
      if (navWritePostBtn) navWritePostBtn.classList.remove('d-none');
      if (navLinkDashboard) navLinkDashboard.classList.remove('d-none');

      if (userDisplayName) userDisplayName.textContent = AppState.currentUser.name;

      if (userRoleBadge) {
        userRoleBadge.textContent = AppState.currentUser.role.toUpperCase();
        userRoleBadge.className = `badge ms-1 ${
          AppState.currentUser.role === 'admin' ? 'badge-role-admin' : 'badge-role-author'
        }`;
      }

      if (navLinkAdmin) {
        if (AppState.currentUser.role === 'admin') {
          navLinkAdmin.classList.remove('d-none');
        } else {
          navLinkAdmin.classList.add('d-none');
        }
      }
    } else {
      if (authActionsVisitor) authActionsVisitor.classList.remove('d-none');
      if (authActionsUser) authActionsUser.classList.add('d-none');
      if (navWritePostBtn) navWritePostBtn.classList.add('d-none');
      if (navLinkDashboard) navLinkDashboard.classList.add('d-none');
      if (navLinkAdmin) navLinkAdmin.classList.add('d-none');
    }
  }

  // --------------------------------------------------------------------------
  // Category Pills & Filter (UC-08)
  // --------------------------------------------------------------------------
  function renderCategoryPills() {
    const container = document.getElementById('categoryPillsContainer');
    if (!container) return;

    let html = `
      <button type="button" class="category-pill ${AppState.activeCategory === 'All' ? 'active' : ''}" data-category="All">
        <i class="bi bi-grid-fill"></i> All Topics (${AppState.posts.length})
      </button>
    `;

    AppState.categories.forEach(cat => {
      const count = AppState.posts.filter(p => p.category === cat).length;
      const isActive = AppState.activeCategory === cat ? 'active' : '';
      html += `
        <button type="button" class="category-pill ${isActive}" data-category="${escapeHtml(cat)}">
          <i class="bi bi-tag"></i> ${escapeHtml(cat)} (${count})
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.category-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        AppState.activeCategory = btn.dataset.category;
        renderCategoryPills();
        renderBlogPosts();
      });
    });
  }

  // --------------------------------------------------------------------------
  // Blog Post Listing & Search (UC-07, UC-08)
  // --------------------------------------------------------------------------
  function renderBlogPosts() {
    const postsGrid = document.getElementById('postsGrid');
    const postsCountText = document.getElementById('postsCountText');
    if (!postsGrid) return;

    let filtered = AppState.posts.slice();

    // Filter by Category
    if (AppState.activeCategory && AppState.activeCategory !== 'All') {
      filtered = filtered.filter(p => p.category === AppState.activeCategory);
    }

    // Filter by Search Query
    if (AppState.searchQuery && AppState.searchQuery.trim() !== '') {
      const q = AppState.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.content && p.content.toLowerCase().includes(q)) ||
        (p.authorName && p.authorName.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    if (postsCountText) {
      postsCountText.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'post' : 'posts'}`;
    }

    if (filtered.length === 0) {
      postsGrid.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="py-4">
            <i class="bi bi-journal-x text-muted" style="font-size: 3.5rem;"></i>
            <h4 class="mt-3 text-secondary">No blog posts found</h4>
            <p class="text-muted">No posts matched "${escapeHtml(AppState.searchQuery)}" in category "${escapeHtml(AppState.activeCategory)}".</p>
            <button class="btn btn-outline-primary btn-sm mt-2" id="resetSearchBtn">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
            </button>
          </div>
        </div>
      `;

      const resetBtn = document.getElementById('resetSearchBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          AppState.searchQuery = '';
          AppState.activeCategory = 'All';
          const searchInput = document.getElementById('searchInput');
          if (searchInput) searchInput.value = '';
          renderCategoryPills();
          renderBlogPosts();
        });
      }
      return;
    }

    // Render cards
    postsGrid.innerHTML = filtered.map(post => {
      const commentCount = post.commentCount !== undefined ? post.commentCount : AppState.comments.filter(c => c.postId === post.id).length;
      const isLiked = AppState.currentUser && Array.isArray(post.likedBy) && post.likedBy.includes(AppState.currentUser.id);
      const excerpt = post.content.length > 135 ? post.content.substring(0, 135) + '...' : post.content;
      const authorInitial = post.authorName ? post.authorName.charAt(0).toUpperCase() : 'U';
      const postImgSrc = resolveImageUrl(post.image);
      const rawImgAttr = escapeHtml(post.image || '');

      return `
        <div class="col-md-6 col-lg-4">
          <div class="blog-card">
            <div class="card-img-wrapper">
              <img src="${postImgSrc}" alt="${escapeHtml(post.title)}" loading="lazy" onerror="window.handlePostImgError(this, '${rawImgAttr}')">
              <span class="category-badge">${escapeHtml(post.category)}</span>
            </div>
            <div class="card-body">
              <h5 class="card-title post-title-btn" data-post-id="${post.id}">${escapeHtml(post.title)}</h5>
              <p class="card-text">${escapeHtml(excerpt)}</p>
              
              <div class="card-meta">
                <div class="author-info">
                  <div class="avatar-sm">${authorInitial}</div>
                  <div>
                    <span class="fw-semibold text-dark d-block" style="font-size: 0.8rem;">${escapeHtml(post.authorName)}</span>
                    <span class="text-muted" style="font-size: 0.75rem;">${formatDate(post.date)}</span>
                  </div>
                </div>

                <div class="card-actions">
                  <button class="btn-like ${isLiked ? 'liked' : ''}" data-post-id="${post.id}" title="${isLiked ? 'Unlike' : 'Like'}">
                    <i class="bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}"></i>
                    <span>${post.likes || 0}</span>
                  </button>
                  <span class="text-muted" title="${commentCount} Comments">
                    <i class="bi bi-chat-text"></i> ${commentCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click listeners
    postsGrid.querySelectorAll('.post-title-btn').forEach(el => {
      el.addEventListener('click', () => {
        navigateTo('post-detail', parseInt(el.dataset.postId, 10));
      });
    });

    postsGrid.querySelectorAll('.btn-like').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const postId = parseInt(btn.dataset.postId, 10);
        toggleLikePost(postId);
      });
    });
  }

  // --------------------------------------------------------------------------
  // Single Post Detail View (UC-07, UC-09, UC-10, UC-11)
  // --------------------------------------------------------------------------
  async function renderPostDetail(postId) {
    let post = AppState.posts.find(p => p.id === postId);
    const container = document.getElementById('postDetailContent');
    if (!container) return;

    // Fetch live detail from backend if connected
    if (AppState.isBackendOnline) {
      const liveData = await apiRequest(`/api/posts/${postId}`);
      if (liveData) {
        post = liveData;
        // update local cached comments
        if (Array.isArray(liveData.comments)) {
          AppState.comments = AppState.comments.filter(c => c.postId !== postId).concat(liveData.comments);
        }
      }
    }

    if (!post) {
      container.innerHTML = `
        <div class="alert alert-warning text-center my-5">
          <h4>Post Not Found</h4>
          <p>The requested blog post does not exist or has been removed.</p>
          <button class="btn btn-primary" onclick="window.blogApp.navigateTo('home')">Return to Home</button>
        </div>
      `;
      return;
    }

    const isAuthorOrAdmin = AppState.currentUser && (
      AppState.currentUser.id === post.authorId || AppState.currentUser.role === 'admin'
    );
    const isLiked = AppState.currentUser && Array.isArray(post.likedBy) && post.likedBy.includes(AppState.currentUser.id);
    const comments = AppState.comments.filter(c => c.postId === post.id);

    container.innerHTML = `
      <div class="mb-4">
        <button class="btn btn-outline-secondary btn-sm" id="btnBackToHome">
          <i class="bi bi-arrow-left me-1"></i> Back to all posts
        </button>
      </div>

      <div class="post-detail-wrapper">
        <div class="post-header">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="badge bg-primary px-3 py-2 fs-6 rounded-pill">${escapeHtml(post.category)}</span>
            
            ${isAuthorOrAdmin ? `
              <div class="btn-group">
                <button class="btn btn-outline-primary btn-sm" id="btnEditDetailPost">
                  <i class="bi bi-pencil me-1"></i> Edit
                </button>
                <button class="btn btn-outline-danger btn-sm" id="btnDeleteDetailPost">
                  <i class="bi bi-trash me-1"></i> Delete
                </button>
              </div>
            ` : ''}
          </div>

          <h1 class="post-header-title">${escapeHtml(post.title)}</h1>

          <div class="post-meta-details">
            <div class="d-flex align-items-center gap-2">
              <div class="avatar-sm" style="width: 36px; height: 36px; font-size: 0.95rem;">
                ${post.authorName ? post.authorName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <span class="fw-bold text-dark d-block">${escapeHtml(post.authorName)}</span>
                <span class="text-muted" style="font-size: 0.8rem;">Author</span>
              </div>
            </div>

            <div><i class="bi bi-calendar3 me-1"></i> Published on ${formatDate(post.date)}</div>
            <div><i class="bi bi-chat-dots me-1"></i> ${comments.length} Comments</div>
          </div>
        </div>

        ${post.image ? `
          <img src="${resolveImageUrl(post.image)}" alt="${escapeHtml(post.title)}" class="post-detail-img" onerror="window.handlePostImgError(this, '${escapeHtml(post.image || '')}')">
        ` : ''}

        <div class="post-content-body">
          ${escapeHtml(post.content).replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>')}
        </div>

        <!-- Post Action Interaction Bar (UC-11) -->
        <div class="d-flex align-items-center justify-content-between pt-4 mt-4 border-top">
          <button class="btn ${isLiked ? 'btn-danger' : 'btn-outline-danger'} px-4 py-2" id="btnLikeDetailPost">
            <i class="bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'} me-1"></i>
            <span id="detailLikeText">${isLiked ? 'Liked' : 'Like'}</span> (${post.likes || 0})
          </button>

          <button class="btn btn-outline-secondary" id="btnSharePost">
            <i class="bi bi-share me-1"></i> Share Post
          </button>
        </div>
      </div>

      <!-- Comments Section (UC-10) -->
      <div class="post-detail-wrapper mt-4">
        <h4 class="fw-bold mb-4">
          <i class="bi bi-chat-left-text me-2 text-primary"></i> Comments (${comments.length})
        </h4>

        <!-- Add Comment Form -->
        <div class="card bg-light border-0 p-3 mb-4 rounded-3">
          ${AppState.currentUser ? `
            <div class="d-flex gap-3">
              <div class="avatar-sm" style="width: 40px; height: 40px; font-size: 1rem;">
                ${AppState.currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div class="flex-grow-1">
                <form id="commentForm">
                  <div class="mb-2">
                    <textarea class="form-control" id="commentTextInput" rows="3" placeholder="Write a constructive comment as ${escapeHtml(AppState.currentUser.name)}..." required></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary btn-sm">
                    <i class="bi bi-send me-1"></i> Post Comment
                  </button>
                </form>
              </div>
            </div>
          ` : `
            <div class="text-center py-2">
              <p class="text-muted mb-2">You must be logged in to leave a comment.</p>
              <button class="btn btn-primary btn-sm px-3" onclick="window.blogApp.openLoginModal()">
                <i class="bi bi-box-arrow-in-right me-1"></i> Log In to Comment
              </button>
            </div>
          `}
        </div>

        <!-- Comments List -->
        <div id="commentsList">
          ${comments.length === 0 ? `
            <p class="text-muted text-center py-4">No comments yet. Be the first to share your thoughts!</p>
          ` : comments.map(c => `
            <div class="comment-box">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center gap-2">
                  <div class="avatar-sm">${c.userName ? c.userName.charAt(0).toUpperCase() : 'U'}</div>
                  <span class="comment-author-name">${escapeHtml(c.userName)}</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <span class="comment-date">${c.date}</span>
                  ${(AppState.currentUser && (AppState.currentUser.id === c.userId || AppState.currentUser.role === 'admin')) ? `
                    <button class="btn btn-link text-danger p-0 ms-2" onclick="window.blogApp.deleteComment(${c.id})" title="Delete Comment">
                      <i class="bi bi-trash"></i>
                    </button>
                  ` : ''}
                </div>
              </div>
              <p class="mb-0 text-dark" style="font-size: 0.95rem;">${escapeHtml(c.content)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('btnBackToHome').addEventListener('click', () => {
      navigateTo('home');
    });

    document.getElementById('btnLikeDetailPost').addEventListener('click', () => {
      toggleLikePost(post.id);
    });

    document.getElementById('btnSharePost').addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        showToast('Post link copied to clipboard!', 'info');
      } else {
        showToast('Link sharing ready.', 'info');
      }
    });

    const btnEdit = document.getElementById('btnEditDetailPost');
    if (btnEdit) {
      btnEdit.addEventListener('click', () => {
        openEditPostModal(post.id);
      });
    }

    const btnDelete = document.getElementById('btnDeleteDetailPost');
    if (btnDelete) {
      btnDelete.addEventListener('click', () => {
        confirmDeletePost(post.id);
      });
    }

    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
      commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = document.getElementById('commentTextInput').value.trim();
        if (!text) {
          showToast('Comment text cannot be empty.', 'error');
          return;
        }

        // Backend submit
        if (AppState.isBackendOnline) {
          try {
            const res = await fetch(`${AppState.apiBase}/api/posts/${post.id}/comments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: AppState.currentUser.id, content: text })
            });
            const data = await res.json();
            if (res.ok && data.comment) {
              AppState.comments.push(data.comment);
              saveState();
              showToast('Comment saved to Database!', 'success');
              renderPostDetail(post.id);
              return;
            }
          } catch (err) {
            console.warn('Comment backend error, using local fallback:', err);
          }
        }

        // Local fallback
        const newComment = {
          id: Date.now(),
          postId: post.id,
          userId: AppState.currentUser.id,
          userName: AppState.currentUser.name,
          content: text,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };

        AppState.comments.push(newComment);
        saveState();
        showToast('Comment posted successfully!', 'success');
        renderPostDetail(post.id);
      });
    }
  }

  // --------------------------------------------------------------------------
  // Like Post (UC-11)
  // --------------------------------------------------------------------------
  async function toggleLikePost(postId) {
    if (!AppState.currentUser) {
      showToast('Please log in to like posts.', 'warning');
      openLoginModal();
      return;
    }

    const post = AppState.posts.find(p => p.id === postId);
    if (!post) return;

    if (!Array.isArray(post.likedBy)) {
      post.likedBy = [];
    }

    // Backend like toggle
    if (AppState.isBackendOnline) {
      try {
        const res = await fetch(`${AppState.apiBase}/api/posts/${postId}/like`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: AppState.currentUser.id })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          post.likes = data.likes;
          if (data.liked) {
            if (!post.likedBy.includes(AppState.currentUser.id)) post.likedBy.push(AppState.currentUser.id);
            showToast('Post liked (Saved in DB)!', 'success');
          } else {
            post.likedBy = post.likedBy.filter(id => id !== AppState.currentUser.id);
            showToast('Post unliked.', 'info');
          }
          saveState();
          if (AppState.activeView === 'home') renderBlogPosts();
          if (AppState.activeView === 'post-detail' && AppState.currentViewingPostId === postId) renderPostDetail(postId);
          return;
        }
      } catch (err) {
        console.warn('Backend like error:', err);
      }
    }

    // Local fallback
    const userIndex = post.likedBy.indexOf(AppState.currentUser.id);
    if (userIndex === -1) {
      post.likedBy.push(AppState.currentUser.id);
      post.likes = (post.likes || 0) + 1;
      showToast('Post liked!', 'success');
    } else {
      post.likedBy.splice(userIndex, 1);
      post.likes = Math.max(0, (post.likes || 1) - 1);
      showToast('Post unliked.', 'info');
    }

    saveState();
    if (AppState.activeView === 'home') {
      renderBlogPosts();
    } else if (AppState.activeView === 'post-detail' && AppState.currentViewingPostId === postId) {
      renderPostDetail(postId);
    }
  }

  // --------------------------------------------------------------------------
  // Delete Comment (UC-10 / UC-12)
  // --------------------------------------------------------------------------
  async function deleteComment(commentId) {
    const idx = AppState.comments.findIndex(c => c.id === commentId);
    if (idx === -1) return;

    const comm = AppState.comments[idx];
    if (!AppState.currentUser || (AppState.currentUser.id !== comm.userId && AppState.currentUser.role !== 'admin')) {
      showToast('You do not have permission to delete this comment.', 'error');
      return;
    }

    // Backend delete
    if (AppState.isBackendOnline) {
      try {
        await fetch(`${AppState.apiBase}/api/comments/${commentId}?userId=${AppState.currentUser.id}`, {
          method: 'DELETE'
        });
      } catch (err) {
        console.warn('Backend comment delete err:', err);
      }
    }

    AppState.comments.splice(idx, 1);
    saveState();
    showToast('Comment deleted.', 'info');

    if (AppState.activeView === 'post-detail') {
      renderPostDetail(comm.postId);
    } else if (AppState.activeView === 'admin') {
      renderAdminDashboard();
    }
  }

  // --------------------------------------------------------------------------
  // Create & Edit Post (UC-04, UC-05, UC-09)
  // --------------------------------------------------------------------------
  let postModalInstance = null;
  let activeImageBase64 = null;
  let pendingImageFile = null;

  function openCreatePostModal() {
    if (!AppState.currentUser) {
      showToast('You must be logged in to create a post.', 'warning');
      openLoginModal();
      return;
    }

    AppState.editingPostId = null;
    activeImageBase64 = null;
    pendingImageFile = null;

    const modalEl = document.getElementById('postModal');
    const modalTitle = document.getElementById('postModalTitle');
    const form = document.getElementById('postForm');
    const previewImg = document.getElementById('postImagePreview');
    const previewPlaceholder = document.getElementById('imagePlaceholderText');

    if (modalTitle) modalTitle.textContent = 'Create New Blog Post';
    if (form) form.reset();
    if (previewImg) {
      previewImg.style.display = 'none';
      previewImg.src = '';
    }
    if (previewPlaceholder) previewPlaceholder.style.display = 'block';

    populateCategoryDropdown('postCategorySelect');

    postModalInstance = new bootstrap.Modal(modalEl);
    postModalInstance.show();
  }

  function openEditPostModal(postId) {
    const post = AppState.posts.find(p => p.id === postId);
    if (!post) return;

    if (!AppState.currentUser || (AppState.currentUser.id !== post.authorId && AppState.currentUser.role !== 'admin')) {
      showToast('You are not authorized to edit this post.', 'error');
      return;
    }

    AppState.editingPostId = postId;
    activeImageBase64 = post.image || null;
    pendingImageFile = null;

    const modalEl = document.getElementById('postModal');
    const modalTitle = document.getElementById('postModalTitle');
    const titleInput = document.getElementById('postTitleInput');
    const contentInput = document.getElementById('postContentInput');
    const previewImg = document.getElementById('postImagePreview');
    const previewPlaceholder = document.getElementById('imagePlaceholderText');

    if (modalTitle) modalTitle.textContent = 'Edit Blog Post';
    if (titleInput) titleInput.value = post.title;
    if (contentInput) contentInput.value = post.content;

    populateCategoryDropdown('postCategorySelect', post.category);

    if (post.image && previewImg) {
      previewImg.src = resolveImageUrl(post.image);
      previewImg.style.display = 'block';
      if (previewPlaceholder) previewPlaceholder.style.display = 'none';
    } else {
      if (previewImg) previewImg.style.display = 'none';
      if (previewPlaceholder) previewPlaceholder.style.display = 'block';
    }

    postModalInstance = new bootstrap.Modal(modalEl);
    postModalInstance.show();
  }

  function populateCategoryDropdown(elementId, selectedCategory = '') {
    const select = document.getElementById(elementId);
    if (!select) return;

    select.innerHTML = AppState.categories.map(cat => `
      <option value="${escapeHtml(cat)}" ${cat === selectedCategory ? 'selected' : ''}>${escapeHtml(cat)}</option>
    `).join('');
  }

  async function handlePostFormSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('postTitleInput').value.trim();
    const category = document.getElementById('postCategorySelect').value;
    const content = document.getElementById('postContentInput').value.trim();

    if (!title || !content) {
      showToast('Title and Content are required fields.', 'error');
      return;
    }

    let finalImageUrl = activeImageBase64;

    // Upload image file to server if file was selected
    if (pendingImageFile && AppState.isBackendOnline) {
      const formData = new FormData();
      formData.append('image', pendingImageFile);
      try {
        const uploadRes = await fetch(`${AppState.apiBase}/api/upload`, {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.imageUrl) {
          finalImageUrl = uploadData.imageUrl.startsWith('/uploads/') ? uploadData.imageUrl.substring(1) : uploadData.imageUrl;
        }
      } catch (err) {
        console.warn('Image upload failed, using fallback base64:', err);
      }
    }

    if (AppState.editingPostId) {
      // Edit post (UC-05)
      if (AppState.isBackendOnline) {
        try {
          const res = await fetch(`${AppState.apiBase}/api/posts/${AppState.editingPostId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title,
              category,
              content,
              image: finalImageUrl,
              userId: AppState.currentUser.id
            })
          });
          if (res.ok) {
            showToast('Post updated in Database!', 'success');
            await syncData();
            if (postModalInstance) postModalInstance.hide();
            if (AppState.activeView === 'post-detail') renderPostDetail(AppState.editingPostId);
            return;
          }
        } catch (err) {
          console.warn('Edit post backend error:', err);
        }
      }

      // Local fallback
      const post = AppState.posts.find(p => p.id === AppState.editingPostId);
      if (post) {
        post.title = title;
        post.category = category;
        post.content = content;
        if (finalImageUrl) post.image = finalImageUrl.startsWith('/uploads/') ? finalImageUrl.substring(1) : finalImageUrl;
        saveState();
        showToast('Blog post updated successfully!', 'success');
        if (AppState.activeView === 'post-detail') {
          renderPostDetail(post.id);
        } else if (AppState.activeView === 'profile') {
          renderProfileView();
        } else {
          renderBlogPosts();
        }
      }
    } else {
      // Create post (UC-04)
      if (AppState.isBackendOnline) {
        try {
          const res = await fetch(`${AppState.apiBase}/api/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title,
              category,
              content,
              image: finalImageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
              authorId: AppState.currentUser.id
            })
          });
          const data = await res.json();
          if (res.ok) {
            showToast('Blog post published and stored in Database!', 'success');
            await syncData();
            if (postModalInstance) postModalInstance.hide();
            navigateTo('home');
            return;
          }
        } catch (err) {
          console.warn('Create post backend error:', err);
        }
      }

      // Local fallback
      const cleanImg = finalImageUrl && finalImageUrl.startsWith('/uploads/') ? finalImageUrl.substring(1) : finalImageUrl;
      const newPost = {
        id: Date.now(),
        title: title,
        content: content,
        category: category,
        authorId: AppState.currentUser.id,
        authorName: AppState.currentUser.name,
        date: new Date().toISOString().split('T')[0],
        image: cleanImg || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
        likes: 0,
        likedBy: []
      };

      AppState.posts.unshift(newPost);
      saveState();
      showToast('New blog post published successfully!', 'success');
      if (AppState.activeView === 'profile') {
        renderProfileView();
      } else {
        renderBlogPosts();
      }
    }

    if (postModalInstance) {
      postModalInstance.hide();
    }
  }

  // --------------------------------------------------------------------------
  // Delete Post with Confirmation Modal (UC-06)
  // --------------------------------------------------------------------------
  let pendingDeletePostId = null;
  let deleteModalInstance = null;

  function confirmDeletePost(postId) {
    const post = AppState.posts.find(p => p.id === postId);
    if (!post) return;

    if (!AppState.currentUser || (AppState.currentUser.id !== post.authorId && AppState.currentUser.role !== 'admin')) {
      showToast('You do not have permission to delete this post.', 'error');
      return;
    }

    pendingDeletePostId = postId;
    const modalEl = document.getElementById('deleteConfirmModal');
    const textEl = document.getElementById('deleteConfirmPostTitle');
    if (textEl) textEl.textContent = `"${post.title}"`;

    deleteModalInstance = new bootstrap.Modal(modalEl);
    deleteModalInstance.show();
  }

  async function executeDeletePost() {
    if (!pendingDeletePostId) return;

    // Backend delete
    if (AppState.isBackendOnline) {
      try {
        await fetch(`${AppState.apiBase}/api/posts/${pendingDeletePostId}?userId=${AppState.currentUser.id}`, {
          method: 'DELETE'
        });
        showToast('Blog post removed from Database.', 'info');
      } catch (err) {
        console.warn('Delete backend error:', err);
      }
    }

    const idx = AppState.posts.findIndex(p => p.id === pendingDeletePostId);
    if (idx !== -1) {
      AppState.posts.splice(idx, 1);
      AppState.comments = AppState.comments.filter(c => c.postId !== pendingDeletePostId);
      saveState();
      showToast('Blog post has been deleted successfully.', 'info');
    }

    if (deleteModalInstance) {
      deleteModalInstance.hide();
    }

    pendingDeletePostId = null;

    if (AppState.activeView === 'admin') {
      renderAdminDashboard();
    } else if (AppState.activeView === 'profile') {
      renderProfileView();
    } else {
      navigateTo('home');
    }
  }

  // --------------------------------------------------------------------------
  // Author Dashboard & Manage Profile (UC-03)
  // --------------------------------------------------------------------------
  function renderProfileView() {
    if (!AppState.currentUser) return;

    const user = AppState.currentUser;
    const nameInput = document.getElementById('profileNameInput');
    const emailInput = document.getElementById('profileEmailInput');
    const bioInput = document.getElementById('profileBioInput');
    const profileInitial = document.getElementById('profileAvatarInitial');
    const profileHeadingName = document.getElementById('profileHeadingName');
    const profileRoleBadge = document.getElementById('profileRoleBadge');
    const profileJoinedDate = document.getElementById('profileJoinedDate');
    const profileTopCategory = document.getElementById('profileTopCategory');
    const profileAdminShortcutBtn = document.getElementById('profileAdminShortcutBtn');

    // Dashboard Metric elements
    const statPostsEl = document.getElementById('profileStatPosts');
    const statLikesEl = document.getElementById('profileStatLikes');
    const statCommentsEl = document.getElementById('profileStatComments');
    const statAvgLikesEl = document.getElementById('profileStatAvgLikes');
    const postsBadge = document.getElementById('profilePostsBadge');
    const commentsBadge = document.getElementById('profileCommentsBadge');
    const topPostContent = document.getElementById('profileTopPostContent');
    const commentsListEl = document.getElementById('profileCommentsReceivedList');
    const myPostsContainer = document.getElementById('myPostsList');

    if (nameInput) nameInput.value = user.name;
    if (emailInput) emailInput.value = user.email;
    if (bioInput) bioInput.value = user.bio || '';
    if (profileInitial) profileInitial.textContent = user.name.charAt(0).toUpperCase();
    if (profileHeadingName) profileHeadingName.textContent = user.name;
    if (profileRoleBadge) {
      profileRoleBadge.textContent = user.role.toUpperCase();
      profileRoleBadge.className = `badge ${user.role === 'admin' ? 'badge-role-admin' : 'badge-role-author'}`;
    }
    if (profileJoinedDate) {
      profileJoinedDate.textContent = user.joined || 'September 2026';
    }
    if (profileAdminShortcutBtn) {
      if (user.role === 'admin') {
        profileAdminShortcutBtn.classList.remove('d-none');
      } else {
        profileAdminShortcutBtn.classList.add('d-none');
      }
    }

    // Filter author's posts
    const myPosts = AppState.posts.filter(p => p.authorId === user.id || p.authorName === user.name);
    const myPostIds = new Set(myPosts.map(p => p.id));

    // Calculate metrics
    const totalPosts = myPosts.length;
    const totalLikes = myPosts.reduce((sum, p) => sum + (p.likes || 0), 0);

    // Comments received on author's posts
    const myPostComments = AppState.comments ? AppState.comments.filter(c => myPostIds.has(c.postId)) : [];
    const totalComments = myPostComments.length;
    const avgLikes = totalPosts > 0 ? (totalLikes / totalPosts).toFixed(1) : '0';

    // Calculate top category
    const catMap = {};
    myPosts.forEach(p => {
      const cat = p.category || 'General';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    let topCat = 'General';
    let maxCnt = 0;
    Object.entries(catMap).forEach(([cat, cnt]) => {
      if (cnt > maxCnt) {
        maxCnt = cnt;
        topCat = cat;
      }
    });
    if (profileTopCategory) {
      profileTopCategory.textContent = totalPosts > 0 ? topCat : 'General';
    }

    // Update Dashboard Stat Numbers
    if (statPostsEl) statPostsEl.textContent = totalPosts;
    if (statLikesEl) statLikesEl.textContent = totalLikes;
    if (statCommentsEl) statCommentsEl.textContent = totalComments;
    if (statAvgLikesEl) statAvgLikesEl.textContent = avgLikes;
    if (postsBadge) postsBadge.textContent = `${totalPosts} Post${totalPosts === 1 ? '' : 's'}`;
    if (commentsBadge) commentsBadge.textContent = `${totalComments} Comment${totalComments === 1 ? '' : 's'}`;

    // Top Performing Post preview
    if (topPostContent) {
      if (myPosts.length === 0) {
        topPostContent.innerHTML = `
          <p class="text-muted small mb-0">Publish articles to view your top performing post statistics here.</p>
        `;
      } else {
        const sorted = [...myPosts].sort((a, b) => (b.likes || 0) - (a.likes || 0));
        const topPost = sorted[0];
        const topPostCommentCnt = AppState.comments ? AppState.comments.filter(c => c.postId === topPost.id).length : 0;
        topPostContent.innerHTML = `
          <h6 class="fw-bold mb-1">
            <a href="javascript:void(0)" onclick="window.blogApp.navigateTo('post-detail', ${topPost.id})" class="text-decoration-none text-dark">
              ${escapeHtml(topPost.title)}
            </a>
          </h6>
          <div class="d-flex align-items-center gap-2 text-muted small mt-2">
            <span class="badge bg-secondary-subtle text-secondary">${escapeHtml(topPost.category)}</span>
            <span><i class="bi bi-heart-fill text-danger me-1"></i><strong>${topPost.likes || 0}</strong> likes</span>
            <span><i class="bi bi-chat-fill text-primary me-1"></i><strong>${topPostCommentCnt}</strong> comments</span>
          </div>
          <button class="btn btn-outline-primary btn-sm w-100 mt-3" onclick="window.blogApp.navigateTo('post-detail', ${topPost.id})">
            <i class="bi bi-box-arrow-up-right me-1"></i> View Article
          </button>
        `;
      }
    }

    // Render My Posts list
    if (myPostsContainer) {
      if (myPosts.length === 0) {
        myPostsContainer.innerHTML = `
          <div class="text-center py-4 text-muted">
            <i class="bi bi-journal-x fs-1 mb-2 d-block text-secondary"></i>
            <p class="mb-2">You haven't written any blog posts yet.</p>
            <button class="btn btn-primary btn-sm" onclick="window.blogApp.openCreatePostModal()">
              <i class="bi bi-pencil-square me-1"></i> Write Your First Post
            </button>
          </div>
        `;
      } else {
        myPostsContainer.innerHTML = myPosts.map(p => {
          const commentCnt = AppState.comments ? AppState.comments.filter(c => c.postId === p.id).length : 0;
          return `
            <div class="list-group-item d-flex justify-content-between align-items-center py-3 px-2">
              <div class="me-3">
                <h6 class="mb-1 fw-bold">
                  <a href="javascript:void(0)" onclick="window.blogApp.navigateTo('post-detail', ${p.id})" class="text-decoration-none text-dark">
                    ${escapeHtml(p.title)}
                  </a>
                </h6>
                <div class="text-muted small d-flex align-items-center flex-wrap gap-2">
                  <span class="badge bg-secondary">${escapeHtml(p.category)}</span>
                  <span><i class="bi bi-calendar3 me-1"></i>${formatDate(p.date)}</span>
                  <span>&bull;</span>
                  <span><i class="bi bi-heart-fill text-danger me-1"></i>${p.likes || 0} likes</span>
                  <span>&bull;</span>
                  <span><i class="bi bi-chat-text-fill text-primary me-1"></i>${commentCnt} comments</span>
                </div>
              </div>
              <div class="btn-group">
                <button class="btn btn-outline-secondary btn-sm" title="View Article" onclick="window.blogApp.navigateTo('post-detail', ${p.id})">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-outline-primary btn-sm" title="Edit Article" onclick="window.blogApp.openEditPostModal(${p.id})">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm" title="Delete Article" onclick="window.blogApp.confirmDeletePost(${p.id})">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Render Recent Reader Comments
    if (commentsListEl) {
      if (myPostComments.length === 0) {
        commentsListEl.innerHTML = `
          <div class="text-center py-3 text-muted">
            <p class="mb-0 small">No comments received on your posts yet. When readers engage with your articles, comments will show up here.</p>
          </div>
        `;
      } else {
        const recentComments = [...myPostComments].reverse().slice(0, 5);
        commentsListEl.innerHTML = recentComments.map(c => {
          const targetPost = AppState.posts.find(p => p.id === c.postId);
          const postTitle = targetPost ? targetPost.title : 'Post #' + c.postId;
          const commenterInitial = (c.userName || 'U').charAt(0).toUpperCase();
          return `
            <div class="border-bottom py-3">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <div class="d-flex align-items-center gap-2">
                  <div class="avatar-sm bg-primary text-white d-flex align-items-center justify-content-center rounded-circle" style="width: 26px; height: 26px; font-size: 0.75rem;">
                    ${commenterInitial}
                  </div>
                  <strong class="small text-dark">${escapeHtml(c.userName || 'Anonymous')}</strong>
                  <span class="text-muted small">&bull; on <a href="javascript:void(0)" onclick="window.blogApp.navigateTo('post-detail', ${c.postId})" class="text-decoration-none fw-semibold">${escapeHtml(postTitle)}</a></span>
                </div>
                <small class="text-muted">${formatDate(c.date)}</small>
              </div>
              <p class="mb-0 small text-secondary ps-4">${escapeHtml(c.content)}</p>
            </div>
          `;
        }).join('');
      }
    }
  }

  async function handleProfileUpdate(e) {
    e.preventDefault();
    if (!AppState.currentUser) return;

    const name = document.getElementById('profileNameInput').value.trim();
    const email = document.getElementById('profileEmailInput').value.trim().toLowerCase();
    const bio = document.getElementById('profileBioInput').value.trim();
    const newPassword = document.getElementById('profileNewPasswordInput').value;

    if (!name || !email) {
      showToast('Name and email are required.', 'error');
      return;
    }

    // Backend update
    if (AppState.isBackendOnline) {
      try {
        const res = await fetch(`${AppState.apiBase}/api/auth/profile/${AppState.currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, bio, password: newPassword })
        });
        const data = await res.json();
        if (res.ok && data.user) {
          AppState.currentUser = Object.assign({}, AppState.currentUser, data.user);
          saveState();
          updateAuthUI();
          renderProfileView();
          showToast('Profile updated in Database!', 'success');
          return;
        }
      } catch (err) {
        console.warn('Backend profile update err:', err);
      }
    }

    // Local fallback
    const user = AppState.users.find(u => u.id === AppState.currentUser.id);
    if (user) {
      user.name = name;
      user.email = email;
      user.bio = bio;
      if (newPassword && newPassword.trim() !== '') {
        user.password = newPassword.trim();
      }
      AppState.currentUser = user;

      AppState.posts.forEach(p => {
        if (p.authorId === user.id) {
          p.authorName = name;
        }
      });

      saveState();
      updateAuthUI();
      renderProfileView();
      showToast('Profile updated successfully!', 'success');
    }
  }

  // --------------------------------------------------------------------------
  // Administrator Management (UC-12)
  // --------------------------------------------------------------------------
  async function renderAdminDashboard() {
    if (!AppState.currentUser || AppState.currentUser.role !== 'admin') {
      navigateTo('home');
      return;
    }

    // Fetch stats from backend if connected
    let stats = {
      totalUsers: AppState.users.length,
      totalPosts: AppState.posts.length,
      totalComments: AppState.comments.length,
      totalLikes: AppState.posts.reduce((sum, p) => sum + (p.likes || 0), 0)
    };

    if (AppState.isBackendOnline) {
      const liveStats = await apiRequest('/api/admin/stats');
      if (liveStats) stats = liveStats;
    }

    const totalUsersEl = document.getElementById('adminStatUsers');
    const totalPostsEl = document.getElementById('adminStatPosts');
    const totalCommentsEl = document.getElementById('adminStatComments');
    const totalLikesEl = document.getElementById('adminStatLikes');

    if (totalUsersEl) totalUsersEl.textContent = stats.totalUsers;
    if (totalPostsEl) totalPostsEl.textContent = stats.totalPosts;
    if (totalCommentsEl) totalCommentsEl.textContent = stats.totalComments;
    if (totalLikesEl) totalLikesEl.textContent = stats.totalLikes;

    // Render Posts Table
    const postsTableBody = document.getElementById('adminPostsTableBody');
    if (postsTableBody) {
      postsTableBody.innerHTML = AppState.posts.map(p => `
        <tr>
          <td><span class="fw-bold">#${p.id}</span></td>
          <td>
            <a href="javascript:void(0)" onclick="window.blogApp.navigateTo('post-detail', ${p.id})" class="fw-semibold text-decoration-none">
              ${escapeHtml(p.title.length > 40 ? p.title.substring(0, 40) + '...' : p.title)}
            </a>
          </td>
          <td>${escapeHtml(p.authorName)}</td>
          <td><span class="badge bg-light text-dark border">${escapeHtml(p.category)}</span></td>
          <td>${formatDate(p.date)}</td>
          <td><i class="bi bi-heart-fill text-danger me-1"></i>${p.likes || 0}</td>
          <td>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" onclick="window.blogApp.openEditPostModal(${p.id})" title="Edit Post">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-danger" onclick="window.blogApp.confirmDeletePost(${p.id})" title="Delete Post">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    // Render Users Table
    let usersList = AppState.users;
    if (AppState.isBackendOnline) {
      const liveUsers = await apiRequest('/api/admin/users');
      if (Array.isArray(liveUsers)) usersList = liveUsers;
    }

    const usersTableBody = document.getElementById('adminUsersTableBody');
    if (usersTableBody) {
      usersTableBody.innerHTML = usersList.map(u => {
        const postCount = u.postCount !== undefined ? u.postCount : AppState.posts.filter(p => p.authorId === u.id).length;
        const isSelf = AppState.currentUser.id === u.id;
        return `
          <tr>
            <td><span class="fw-bold">#${u.id}</span></td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="avatar-sm">${u.name.charAt(0).toUpperCase()}</div>
                <span class="fw-semibold">${escapeHtml(u.name)}</span>
              </div>
            </td>
            <td>${escapeHtml(u.email)}</td>
            <td>
              <span class="badge ${u.role === 'admin' ? 'badge-role-admin' : 'badge-role-author'}">
                ${u.role.toUpperCase()}
              </span>
            </td>
            <td>${postCount} posts</td>
            <td>
              ${isSelf ? `
                <span class="badge bg-secondary">Current Session</span>
              ` : `
                <button class="btn btn-outline-danger btn-sm" onclick="window.blogApp.adminDeleteUser(${u.id})" title="Delete User">
                  <i class="bi bi-trash me-1"></i> Delete
                </button>
              `}
            </td>
          </tr>
        `;
      }).join('');
    }

    // Render Comments Table
    let commentsList = AppState.comments;
    if (AppState.isBackendOnline) {
      const liveComments = await apiRequest('/api/admin/comments');
      if (Array.isArray(liveComments)) commentsList = liveComments;
    }

    const commentsTableBody = document.getElementById('adminCommentsTableBody');
    if (commentsTableBody) {
      commentsTableBody.innerHTML = commentsList.map(c => {
        const post = AppState.posts.find(p => p.id === c.postId);
        const postTitle = c.postTitle || (post ? post.title : 'Post #' + c.postId);
        return `
          <tr>
            <td><span class="fw-bold">#${c.id}</span></td>
            <td>${escapeHtml(c.userName)}</td>
            <td>
              <span class="text-truncate d-inline-block" style="max-width: 250px;">
                ${escapeHtml(c.content)}
              </span>
            </td>
            <td>
              <a href="javascript:void(0)" onclick="window.blogApp.navigateTo('post-detail', ${c.postId})" class="text-decoration-none">
                ${escapeHtml(postTitle.length > 25 ? postTitle.substring(0, 25) + '...' : postTitle)}
              </a>
            </td>
            <td><small class="text-muted">${c.date}</small></td>
            <td>
              <button class="btn btn-outline-danger btn-sm" onclick="window.blogApp.deleteComment(${c.id})" title="Delete Comment">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  async function adminDeleteUser(userId) {
    if (!confirm('Are you sure you want to remove this user? Their account will be deleted.')) {
      return;
    }

    if (AppState.isBackendOnline) {
      try {
        await fetch(`${AppState.apiBase}/api/admin/users/${userId}?adminId=${AppState.currentUser.id}`, {
          method: 'DELETE'
        });
      } catch (err) {
        console.warn('Backend user delete err:', err);
      }
    }

    const idx = AppState.users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      AppState.users.splice(idx, 1);
      saveState();
      showToast('User removed successfully.', 'info');
      renderAdminDashboard();
    }
  }

  // --------------------------------------------------------------------------
  // Modals & Image Upload Setup (UC-09)
  // --------------------------------------------------------------------------
  let loginModalInstance = null;
  let registerModalInstance = null;
  let dbModalInstance = null;

  function openLoginModal(promptMessage = null) {
    const modalEl = document.getElementById('loginModal');
    if (!modalEl) return;

    // Reset login form fields so credentials are never pre-filled
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.reset();
    const emailInput = document.getElementById('loginEmailInput');
    const passInput = document.getElementById('loginPasswordInput');
    if (emailInput) emailInput.value = '';
    if (passInput) passInput.value = '';

    const alertEl = document.getElementById('loginModalAlert');
    const alertText = document.getElementById('loginModalAlertText');
    if (alertEl && alertText) {
      if (promptMessage) {
        alertText.textContent = promptMessage;
        alertEl.classList.remove('d-none');
      } else {
        alertEl.classList.add('d-none');
      }
    }

    loginModalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    loginModalInstance.show();
  }

  function openRegisterModal() {
    const modalEl = document.getElementById('registerModal');
    if (!modalEl) return;
    registerModalInstance = new bootstrap.Modal(modalEl);
    registerModalInstance.show();
  }

  function openDbModal() {
    const modalEl = document.getElementById('dbModal');
    if (!modalEl) return;

    // Populate live DB status
    const dbStatusEngine = document.getElementById('dbModalEngine');
    const dbStatusHost = document.getElementById('dbModalHost');
    const dbStatusDatabase = document.getElementById('dbModalDatabase');
    const dbStatusMessage = document.getElementById('dbModalMessage');
    const dbStatusUsers = document.getElementById('dbModalUsers');
    const dbStatusPosts = document.getElementById('dbModalPosts');
    const dbStatusComments = document.getElementById('dbModalComments');
    const dbStatusLikes = document.getElementById('dbModalLikes');

    if (AppState.isBackendOnline && AppState.backendInfo) {
      const dbInfo = AppState.backendInfo.database || {};
      if (dbStatusEngine) dbStatusEngine.textContent = dbInfo.engine || 'MySQL';
      if (dbStatusHost) dbStatusHost.textContent = dbInfo.host || '127.0.0.1:3306';
      if (dbStatusDatabase) dbStatusDatabase.textContent = dbInfo.database || 'blog_db';
      if (dbStatusMessage) dbStatusMessage.textContent = dbInfo.message || 'Connected to backend server.';
      if (dbStatusUsers) dbStatusUsers.textContent = dbInfo.counts?.users || AppState.users.length;
      if (dbStatusPosts) dbStatusPosts.textContent = dbInfo.counts?.posts || AppState.posts.length;
      if (dbStatusComments) dbStatusComments.textContent = dbInfo.counts?.comments || AppState.comments.length;
      if (dbStatusLikes) dbStatusLikes.textContent = dbInfo.counts?.likes || 24;
    } else {
      if (dbStatusEngine) dbStatusEngine.textContent = 'SQLite / Local Storage';
      if (dbStatusHost) dbStatusHost.textContent = 'Local Browser Session';
      if (dbStatusDatabase) dbStatusDatabase.textContent = 'localStorage (Offline Mode)';
      if (dbStatusMessage) dbStatusMessage.textContent = 'Flask backend is not running on port 5000. Start "python app.py" to connect live MySQL.';
      if (dbStatusUsers) dbStatusUsers.textContent = AppState.users.length;
      if (dbStatusPosts) dbStatusPosts.textContent = AppState.posts.length;
      if (dbStatusComments) dbStatusComments.textContent = AppState.comments.length;
      if (dbStatusLikes) dbStatusLikes.textContent = 24;
    }

    dbModalInstance = new bootstrap.Modal(modalEl);
    dbModalInstance.show();
  }

  function setupImageUpload() {
    const fileInput = document.getElementById('postImageFileInput');
    const previewContainer = document.getElementById('imageUploadContainer');
    const previewImg = document.getElementById('postImagePreview');
    const placeholderText = document.getElementById('imagePlaceholderText');

    if (!fileInput || !previewContainer) return;

    previewContainer.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        showToast('Unsupported file type. Please upload a JPG or PNG image.', 'error');
        fileInput.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size exceeds 5MB limit.', 'warning');
        return;
      }

      pendingImageFile = file;

      const reader = new FileReader();
      reader.onload = (event) => {
        activeImageBase64 = event.target.result;
        if (previewImg) {
          previewImg.src = activeImageBase64;
          previewImg.style.display = 'block';
        }
        if (placeholderText) {
          placeholderText.style.display = 'none';
        }
        showToast('Image selected successfully!', 'success');
      };
      reader.readAsDataURL(file);
    });
  }

  // --------------------------------------------------------------------------
  // Event Listeners & Initialization
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', async () => {
    initStorage();
    setupImageUpload();
    updateAuthUI();

    // Render local initial data immediately for zero lag
    renderCategoryPills();
    renderBlogPosts();

    // Search bar input listener (UC-08)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        AppState.searchQuery = e.target.value;
        renderBlogPosts();
      });
    }

    // Navbar Navigation
    const navLinkHome = document.getElementById('navLinkHome');
    if (navLinkHome) {
      navLinkHome.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('home');
      });
    }

    const navLinkDashboard = document.getElementById('navLinkDashboard');
    if (navLinkDashboard) {
      navLinkDashboard.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('profile');
      });
    }

    const navLinkAdmin = document.getElementById('navLinkAdmin');
    if (navLinkAdmin) {
      navLinkAdmin.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('admin');
      });
    }

    const navWritePostBtn = document.getElementById('navWritePostBtn');
    if (navWritePostBtn) {
      navWritePostBtn.addEventListener('click', () => {
        openCreatePostModal();
      });
    }

    const navProfileLink = document.getElementById('navProfileLink');
    if (navProfileLink) {
      navProfileLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('profile');
      });
    }

    const navLogoutBtn = document.getElementById('navLogoutBtn');
    if (navLogoutBtn) {
      navLogoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logoutUser();
      });
    }

    // Login Form Submit (UC-02)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmailInput').value;
        const pass = document.getElementById('loginPasswordInput').value;
        const success = await loginUser(email, pass);
        if (success) {
          if (loginModalInstance) {
            loginModalInstance.hide();
          }
          if (AppState.currentUser && AppState.currentUser.role === 'admin') {
            navigateTo('admin');
          } else {
            navigateTo('home');
          }
        }
      });
    }

    // Register Form Submit (UC-01)
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regNameInput').value;
        const email = document.getElementById('regEmailInput').value;
        const pass = document.getElementById('regPasswordInput').value;
        const role = document.getElementById('regRoleSelect').value;
        const success = await registerUser(name, email, pass, role);
        if (success && registerModalInstance) {
          registerModalInstance.hide();
        }
      });
    }

    // Post Create/Edit Form Submit (UC-04, UC-05)
    const postForm = document.getElementById('postForm');
    if (postForm) {
      postForm.addEventListener('submit', handlePostFormSubmit);
    }

    // Delete Post Confirmation Button (UC-06)
    const confirmDeleteBtn = document.getElementById('confirmDeletePostBtn');
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', executeDeletePost);
    }

    // Profile Form Submit (UC-03)
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', handleProfileUpdate);
    }


    // Check backend and sync in background
    await syncData();
  });

  // Export functions to global scope
  window.blogApp = {
    navigateTo,
    openLoginModal,
    openRegisterModal,
    openCreatePostModal,
    openEditPostModal,
    confirmDeletePost,
    toggleLikePost,
    deleteComment,
    adminDeleteUser,
    quickSwitchRole,
    openDbModal,
    checkBackendConnection
  };

})();
