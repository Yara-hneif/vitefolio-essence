
# 🛠️ Backend – Vitefolio Essence

This folder contains the **Express.js** backend of the Vitefolio Essence full-stack project.

## ⚙️ Technologies Used
- **Node.js** + **Express.js**
- **CORS**
- **Nodemon** (for development)
- **dotenv** (for environment configuration)

## 📁 Folder Structure
```
server/
├── data/              # In-memory or JSON-based mock database
├── routes/            # API route handlers (e.g., /api/projects)
├── index.js           # Entry point for the backend server
├── package.json       # Backend dependencies and scripts
└── .env               # Environment variables (e.g., PORT)
```

## 🚀 Scripts
```bash
npm start       # Start server in production mode
npm run dev     # Start server in development mode using nodemon
```

## 📦 API Endpoints
| Route              | Method | Description            |
|-------------------|--------|------------------------|
| /api/projects     | GET    | Get list of projects   |
| /api/contact      | POST   | Submit contact message |

---

🔒 Ensure `.env` file exists with:
```
PORT=5000
```

📝 All data is currently stored in memory or local files (future-ready for DB integration).
