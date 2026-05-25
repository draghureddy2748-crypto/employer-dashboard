# TalentFlow 🌌 — Advanced Employer Portal & Applicant Tracking System

TalentFlow is a high-fidelity, premium **Employer Dashboard & Applicant Tracking System (ATS)** styled with Stripe and Linear aesthetics. Built with **React 19, Vite, Express, and MongoDB**, it features robust session-gating, interactive analytical dashboards, AI assistants, and a fully polished responsive dark/light interface.

---

## 🚀 Premium Features

### 1. 🛡️ Advanced Gated Authentication
- **Secure Sessions**: Uses HTTP-Only, Secure, and SameSite cookied JWT tokens.
- **Mount Verification**: Persistent AuthContext verifying tokens on page refreshes with elegant full-screen spinner indicators.
- **Auto-Expiry Interceptors**: Global Axios response interceptor that automatically redirects expired or unauthorized sessions to `/login`.

### 2. 📊 High-Fidelity Recharts Analytics
- **KPI Summary Cards**: Responsive metrics highlighting Total Postings, Candidate counts, and funnel Shortlist conversion rates.
- **Pipeline Trends Chart**: Recharts `AreaChart` compiling application dates chronologically.
- **Applications per Job Chart**: Recharts `BarChart` comparing application counts across vacancies.
- **Status Distribution**: Recharts `PieChart` breaking down candidate milestones.

### 3. 🎯 Full Applicant Pipeline & Kanban Board
- **Fluid Kanban Board**: Responsive 6-stage workflow grid (`lg:grid-cols-6`) representing `Applied`, `Reviewing`, `Shortlisted`, `Interview Scheduled`, `Rejected`, and `Hired` milestones.
- **Card Slide Actions**: Inline arrow triggers allowing quick candidate status increments directly on the boards.
- **Candidate Profiles**: Modals displaying contact cards, cover letter texts, resume files, and stage selectors.
- **Multi-Filter Inputs**: Advanced search filters by location, job title, and experience.

### 4. 🧠 Integrated AI Assistants
- **AI Job Description Generator**: Generates professional descriptions based on typed Job Title and Department inputs. Includes OpenAI integration with a high-fidelity local template fallback.
- **AI Resume Matcher**: Candidate scanning engine parsing cover letters, matching skills keywords, computing matching score percentages, and ranking candidates within the job pool.

### 5. 🔔 Active Notifications System
- **Real-Timebell Dropdown**: Bell trigger displaying active unread count animations.
- **Trigger Actions**: Creates automated notifications in the DB when candidates apply or job status changes.
- **Interactive controls**: Custom controls allowing notifications deletion or marking them read in real-time.

### 6. 🌙 Dark/Light Display Persistence
- Premium dark theme defaults with persistent local storage saving toggles for unified dark/light support.

---

## 🛠️ Installation & Local Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** running locally on port `27017` (or MongoDB Atlas link)

### Step 1: Clone and install backend
```bash
cd backend
npm install
```

### Step 2: Configure Backend Environment Variables
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/employer_dashboard
JWT_SECRET=your_super_secure_jwt_token_secret_key_2026
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Optional AI credentials (local high-fidelity fallbacks used if omitted)
OPENAI_API_KEY=your_openai_api_key_here
```

### Step 3: Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Step 4: Run Development Servers
- **Start Backend**: `npm run dev` in `backend` directory (Starts server on `http://localhost:5000`)
- **Start Frontend**: `npm run dev` in `frontend` directory (Starts portal on `http://localhost:5173`)

---

## 🌐 Production Deployment Guide

To deploy TalentFlow securely in production, follow these steps:

### 1. Database Setup: MongoDB Atlas
1. Sign up/Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster (M0) and choose a cloud provider.
3. In "Network Access", add IP address `0.0.0.0/0` (Allows secure API triggers from server hosts).
4. In "Database Access", create a database user and password.
5. In "Database -> Connect", select **Drivers** and copy the Connection String:
   ```text
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/talentflow?retryWrites=true&w=majority
   ```

### 2. Backend Hosting (Render, Railway, Heroku)
1. Link your GitHub repository to your hosting provider.
2. Select **Web Service** and choose Node environment.
3. Set Build Command to `npm install` and Start Command to `npm start`.
4. Configure Environment Variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = *your Atlas connection string copied above*
   - `JWT_SECRET` = *a robust secure key*
   - `CLIENT_URL` = *your deployed frontend URL (e.g. https://talentflow.vercel.app)*

### 3. Frontend Hosting (Vercel, Netlify)
1. Deploy as a Static/SPA site on Vercel or Netlify.
2. Configure Build Command to `npm run build` and Output Directory to `dist`.
3. Set Environment Variable:
   - `VITE_API_URL` = *your deployed backend API URL (e.g. https://api.talentflow.com/api)*

### Recommended Platforms
- **Frontend SPA**: [Vercel](https://vercel.com) (exceptional speed, zero configuration redirects).
- **Backend Service**: [Railway](https://railway.app) or [Render](https://render.com) (painless background process hosting, automatic HTTPS).
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud scaling, automated backups).
