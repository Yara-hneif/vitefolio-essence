import pool from "../../config/db.js";
import slugify from "slugify";

const userId = "4a8bdb28-f98c-4940-84c4-5370f5915cf7"; 

const projects = [
  {
    title: "Personal Portfolio",
    description: "A portfolio website built with React, TailwindCSS, and PostgreSQL.",
    category: "Web",
    tags: ["React", "TailwindCSS", "PostgreSQL"],
    imageUrl: "https://example.com/portfolio.png",
    repoUrl: "https://github.com/Yara-hneif/vitefolio-essence",
    liveUrl: "https://vitefolio.example.com",
  },
  {
    title: "Task Manager App",
    description: "A drag-and-drop task manager with backend in Node.js.",
    category: "Productivity",
    tags: ["React", "Node.js", "DND"],
    imageUrl: "https://example.com/tasks.png",
    repoUrl: "https://github.com/Yara-hneif/task-manager",
    liveUrl: "https://task-manager.example.com",
  },
  {
    title: "Vitefolio Essence",
    description: "A personal portfolio built with React, Vite, TailwindCSS, PostgreSQL, and Express.",
    category: "Web",
    tags: ["React", "TailwindCSS", "PostgreSQL", "Express", "Vite"],
    imageUrl: "https://raw.githubusercontent.com/Yara-hneif/vitefolio-essence/main/screenshot.png",
    repoUrl: "https://github.com/Yara-hneif/vitefolio-essence",
    liveUrl: "https://vitefolio.example.com"
  },
  {
    title: "PlannerX",
    description: "A simple and elegant task manager app built with vanilla JavaScript.",
    category: "Productivity",
    tags: ["JavaScript", "HTML", "CSS"],
    imageUrl: "https://raw.githubusercontent.com/Yara-hneif/PlannerX/main/preview.png",
    repoUrl: "https://github.com/Yara-hneif/PlannerX",
    liveUrl: "https://plannerx.example.com"
  },
  {
    title: "BugZor",
    description: "A bug tracking system that supports JSON, In-Memory, and SQL storage options.",
    category: "Tools",
    tags: ["Node.js", "Express", "SQLite", "File System"],
    imageUrl: "https://example.com/bugzor.png",
    repoUrl: "https://github.com/Yara-hneif/BugZor",
    liveUrl: "https://bugzor.example.com"
  },
  {
    title: "Life Folio Hub",
    description: "An interactive online life journal system with customizable themes and components.",
    category: "Web",
    tags: ["React", "TailwindCSS", "Node.js", "MongoDB"],
    imageUrl: "https://example.com/lifefolio.png",
    repoUrl: "https://github.com/Yara-hneif/life-folio-online-hub",
    liveUrl: "https://lifehub.example.com"
  },
  {
    title: "Semantic Analyzer",
    description: "A semantic checker tool for a mini-C language using Lark parser in Python.",
    category: "Compiler",
    tags: ["Python", "Lark", "Parsing", "Mini-C"],
    imageUrl: "https://example.com/semantic.png",
    repoUrl: "https://github.com/Yara-hneif/semantic-analyzer",
    liveUrl: "https://analyzer.example.com"
  }
];

const seedProjects = async () => {
  try {
    for (const project of projects) {
      const slug = slugify(project.title, { lower: true, strict: true });

      await pool.query(
        `INSERT INTO projects (user_id, title, slug, description, repo_url, live_url, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          userId,
          project.title,
          slug,
          project.description,
          project.repoUrl,
          project.liveUrl,
          "published"
        ]
      );

      console.log(`✅ Inserted project: ${project.title}`);
    }

    console.log("🎉 All projects inserted!");
    process.exit();
  } catch (error) {
    console.error("❌ Error inserting projects:", error);
    process.exit(1);
  }
};

seedProjects();
