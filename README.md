
# 💼 Vitefolio Essence

A modern, full-stack portfolio application built with **Vite + React + TypeScript** on the frontend and **Node.js + Express** on the backend.
This project serves as a personal portfolio site template, offering a clean and professional structure for showcasing projects, contact forms, and future personal branding content.

---

## ✨ Features

- ⚡ Fast development with Vite and TypeScript
- 🎨 Fully responsive modern UI using Tailwind CSS
- 📁 Organized file structure with modular components
- 🌐 Routing with React Router
- 💬 Contact form with backend integration
- 🧩 Easily customizable components

---

## 🚀 Deployment Status

### ***🟢 Backend***  

#### **✅ Deployed on Render** 
- #### ***🔗 Live API:  [https://vitefolio-essence.onrender.com](https://vitefolio-essence.onrender.com)***

#### **Available Routes:**
- `GET /api/projects` – Fetch all portfolio projects
- `POST /api/contact` – Submit contact form messages

---

### ***🔵 Frontend***  
🔧 **Currently in development** (See branch: `feature/frontend-integration`)  
Deployment will support future flexibility via **Render**, **Vercel**, **Netlify**, etc.

---

## 🧱 UI Components

The template includes a modern, reusable UI kit:

- `Header` – Sticky top navigation bar
- `Footer` – Clean, responsive footer
- `Menu` – Mobile-friendly collapsible menu
- `Card` – Project display cards with image, title, and description
- `Button` – Accessible buttons with hover effects

---

## 🚀 Getting Started

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

## 📦Frontend Deployment (GitHub Pages – optional)

To deploy frontend to GitHub Pages:

```bash
cd client
npm run deploy
```


## 📁 Folder Structure

```
vitefolio-essence/
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   ├── lib/            # Utility functions
│   │   └── App.tsx         # Main app entry
├── server/
│   ├── routes/             # API endpoints
│   ├── data/               # Mocked data
│   └── index.js            # Express entry point

```

## 👩🏻‍💻 Author

Built with ❤️ by [Yara Hneif](https://github.com/Yara-hneif)

## 📜 License
This project is licensed under the MIT License.
