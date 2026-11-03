# Modern Flow — Node.js To-Do Application

A modernized full-stack To-Do application built with **Node.js**, **Express**, and a responsive Glassmorphic dashboard UI.

---

## 🌐 How to Access from Anywhere (Public URL)

You have two simple ways to get a public URL for this application:

### Option A: Instant Public Tunnel (Zero Setup)
Want to access the app right now from your phone or send a link to someone?
Run the tunnel script:

```powershell
cd C:\Users\panna001\.gemini\antigravity\scratch\todo-app
.\tunnel.ps1
```

- This will automatically ensure your server is running and generate a public HTTPS URL (e.g. `https://hungry-fox-42.loca.lt`).
- Open that link on your smartphone or any computer outside your home network!
- *(Note: Your computer needs to stay powered on while using this option.)*

---

### Option B: 24/7 Permanent Cloud Deployment (Render / Railway)
Want a permanent public URL (e.g. `https://my-todo.onrender.com`) that stays online 24/7 even when your PC is turned off?

#### Deploying with Render (Free):
1. **Push your code to GitHub**:
   ```powershell
   cd C:\Users\panna001\.gemini\antigravity\scratch\todo-app
   git init
   git add .
   git commit -m "Initial commit of modern to-do app"
   ```
   Create a new repository on [GitHub](https://github.com/new) and push your files:
   ```powershell
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com) (free signup).
   - Click **New +** -> **Web Service**.
   - Connect your GitHub repository.
   - Settings are automatically detected from [`render.yaml`](render.yaml):
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Click **Create Web Service**.
   - In 1–2 minutes, Render gives you a live permanent HTTPS URL!

---

## 💻 Running Locally

To run locally on your own machine without a public URL:

```powershell
cd C:\Users\panna001\.gemini\antigravity\scratch\todo-app
npm start
```
Then visit **[http://localhost:3000](http://localhost:3000)**.

---

## 📁 Project Structure

```
todo-app/
├── server.js              # Node.js + Express REST API server
├── package.json           # Dependencies, scripts, and Node engine
├── render.yaml            # Render.com cloud deployment blueprint
├── tunnel.ps1             # 1-click script for instant public HTTPS URL
├── .gitignore             # Git ignore file for clean commits
├── data/
│   └── todos.json         # JSON database for persisted tasks
└── public/
    ├── index.html         # Modernized frontend layout
    ├── style.css          # Glassmorphic stylesheet with dark/light themes
    └── app.js             # Client-side state manager and API integration
```
