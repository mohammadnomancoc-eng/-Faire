# À Faire — Intent into Action 🎯

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**À Faire** is a sleek, modern productivity & goal-tracking web application built with React, Vite, Tailwind CSS, and Supabase. It bridges daily task management with long-term goal milestones, empowering users to turn intentions into measurable progress.

---

## ✨ Features

- 📅 **Daily Task Management**
  - Create, complete, and organize daily tasks.
  - Set specific **start times**, **end times**, and **reminders**.
  - Interactive status toggles with celebratory animations.

- 🎯 **Long-Term Goals & Landmarks**
  - Define overarching goals with start dates and target end dates.
  - Break goals down into **milestones/landmarks** and linked daily sub-tasks.
  - Automatic progress calculation and visual progress bars.

- 🔐 **Flexible Authentication & Guest Mode**
  - **Cloud Sync:** Secure authentication via Supabase (Email/Password & Google OAuth).
  - **Guest Mode:** Start using the app immediately without signing up (persisted in local state).

- 🎨 **Modern Glassmorphic UI**
  - Sleek dark-mode aesthetic with fluid Framer Motion micro-interactions.
  - Fully responsive design tailored for mobile and desktop screens.
  - Dynamic motivational quotes engine.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS
- **Icons & Animations:** Lucide React, Framer Motion, React Confetti, React CountUp
- **Drag & Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`
- **Backend & Auth:** Supabase (PostgreSQL, Row-Level Security, Auth)
- **Deployment:** Ready for Vercel / Render

---

## 📁 Project Structure

```text
À Faire/
├── public/                 # Static assets & favicon
├── scripts/                # Utility & inspection scripts
├── src/
│   ├── components/         # UI & Feature components
│   │   ├── auth/           # LoginForm, SignupForm
│   │   ├── daily/          # Daily Task Cards & lists
│   │   ├── goals/          # Goals & Milestone tracker
│   │   └── ui/             # Reusable UI primitives (Button, Modal, Input)
│   ├── context/            # Auth & Application context providers
│   ├── hooks/              # Custom React hooks (useDailyTasks, useGoals)
│   ├── lib/                # Supabase client configuration
│   ├── pages/              # Main App views & Dashboard
│   ├── App.jsx             # Root App component
│   ├── index.css           # Custom styles & design system tokens
│   └── main.jsx            # React DOM entry point
├── supabase/
│   ├── schema.sql          # Primary database schema & RLS policies
│   └── migrations/         # Database migration SQL files
├── .env                    # Environment variables (Vite + Supabase)
├── vercel.json             # Vercel deployment configuration
└── vite.config.js          # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- A **Supabase** account (Free tier)

---

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/a-faire.git
cd a-faire

# Install dependencies
npm install
```

---

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

### 3. Database Setup (Supabase)

1. Open your project in the **[Supabase Dashboard](https://supabase.com/dashboard)**.
2. Go to **SQL Editor** $\rightarrow$ **New query**.
3. Copy and run the contents of [`supabase/schema.sql`](file:///f:/Projects/%C3%80%20Faire%20%E2%80%94%20Cursor%20Ai/supabase/schema.sql) to create tables, indexes, triggers, and Row-Level Security (RLS) policies.
4. Run any supplementary scripts from [`supabase/migrations/`](file:///f:/Projects/%C3%80%20Faire%20%E2%80%94%20Cursor%20Ai/supabase/migrations) if updating an existing database.

---

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## 📖 How to Use À Faire

### 1. Authentication & Onboarding
* **Guest Mode:** Click **"Continue without sign up"** on the landing screen to start managing tasks immediately without an account.
* **Account Sync:** Click **"Sign up"** to create a free account or **"Continue with Google"** to sync your data across all your devices.

### 2. Managing Daily Tasks
* Click **"+ Add Task"** on the Daily view.
* Provide a title, set start & end times, and add optional descriptions.
* Click the checkbox next to any task when completed to celebrate progress.

### 3. Tracking Long-Term Goals
* Navigate to the **Goals** section from the navigation bar.
* Click **"+ Create Goal"** and define the start date, target end date, and overall objective.
* Add **Landmarks / Milestones** to break down the goal into achievable phases.
* Link daily tasks to goals to track automatic completion progress.

---

## ⚡ Deployment

### Deploy to Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the project into **[Vercel](https://vercel.com)**.
3. Vercel automatically detects the [`vercel.json`](file:///f:/Projects/%C3%80%20Faire%20%E2%80%94%20Cursor%20Ai/vercel.json) configuration:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add your Environment Variables in Vercel under **Project Settings $\rightarrow$ Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
