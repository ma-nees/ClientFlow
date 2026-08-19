# ClientFlow AI Dashboard
**A Next-Generation Automated Lead Analysis and Cold Outreach Platform for Web Design Studios**

Welcome to the official repository for the ClientFlow AI Dashboard. ClientFlow AI is a highly specialized, AI-driven automation platform built specifically to streamline the client acquisition process for web design and development agencies. 

By deeply integrating modern AI capabilities with native inbox sending, this platform removes the manual effort from prospecting, website auditing, and cold email copywriting, allowing your agency to focus on what matters most: closing deals and building websites.

---

## 🌟 Executive Overview

In the highly competitive web design industry, finding leads and writing cold emails that actually convert is incredibly time-consuming. ClientFlow AI solves this by introducing a fully automated pipeline:
1. **Lead Intake & Analysis**: You provide a list of businesses (via CSV or manual entry), and ClientFlow's backend immediately analyzes their web presence to find critical flaws (e.g., missing websites, slow load times, outdated designs).
2. **Context-Aware AI Pitching**: Instead of generic templates, ClientFlow uses **Mistral AI** to generate highly personalized emails. The AI references the exact flaws found on the prospect's website, proving that you have actually looked at their business.
3. **Native Inbox Delivery**: Emails are dispatched directly through your own Gmail account using OAuth 2.0. This bypasses the spam filters that usually block traditional mass-mailing SMTP servers, ensuring your pitches land in the primary inbox.
4. **Smart Follow-Ups**: The platform monitors your inbox for replies and will automatically pause sequences when a prospect responds, preventing embarrassing automated follow-ups to someone who already replied.

---

## 🏗 System Architecture

The application is built on a decoupled, modern web architecture separating the client-side presentation layer from the heavy backend processing layer.

### 1. Frontend (The Client Application)
The frontend is a Single Page Application (SPA) designed for speed, responsiveness, and aesthetic excellence.
- **Framework & Build Tool**: React 19 powered by Vite for instant Hot Module Replacement (HMR) and optimized production builds.
- **Routing**: `TanStack Router` provides robust, type-safe, file-based routing.
- **State Management**: `TanStack Query` handles asynchronous server state, caching, and synchronization.
- **Styling & UI**: Built with Tailwind CSS and `shadcn/ui` components for a modern, accessible, and highly customizable interface. The UI features a premium dark/light mode toggle.
- **Authentication**: Firebase Authentication is used on the client side to securely manage user sessions via Google OAuth.

### 2. Backend (The API Services)
The backend is a robust Node.js service responsible for data synchronization, AI communication, and scheduled tasks.
- **Framework**: Node.js with Express, written entirely in TypeScript.
- **Database**: Supabase (PostgreSQL) acts as the primary source of truth, storing leads, campaign configurations, and email drafts.
- **AI Engine**: Integrated with the `@mistralai/mistralai` SDK. The backend constructs complex prompts injecting lead data and communicates with the `mistral-large-latest` model to receive structured JSON outputs containing email subjects, bodies, and strategic analysis points.
- **Email Delivery**: Integrates heavily with the Google `googleapis` SDK. It uses OAuth 2.0 to authenticate on behalf of the user, requiring scopes like `gmail.send` and `gmail.readonly` to dispatch emails and monitor threads.

---

## 🚀 Core Features & Modules

### Lead Management & Intelligence
- **Import Engine**: Robust CSV parsing to bulk-import hundreds of leads simultaneously.
- **Automated Opportunity Detection**: The system categorizes leads based on their website status (e.g., "No Website", "Needs Mobile Optimization").
- **Lead Scoring**: An intelligent scoring algorithm ranks leads based on their likelihood to convert, helping you prioritize high-value targets.

### Campaign & Outreach Orchestration
- **Dynamic Variable Injection**: Email templates support dynamic variables that are populated by the AI at runtime.
- **Approval Workflows**: Emails can be set to require manual approval before sending, or fully automated for hands-off outreach.
- **Thread Tracking**: Every email sent is tracked with a Google Thread ID, allowing the system to monitor the exact conversation history.

### Analytics & Insights
- **Performance Dashboards**: Visual charts (powered by Recharts) showing emails sent, open rates, reply rates, and conversion metrics over time.
- **Opportunity Breakdown**: Real-time statistical breakdown of the types of website flaws found in your lead database.

---

## ⚙️ Environment Setup & Configuration

Because of the decoupled nature of the app, you must configure environment variables for both the frontend and the backend.

### Frontend Environment Variables
Create a `.env` file in the root directory (where the frontend `package.json` lives):
```env
# Firebase Client SDK Configuration
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Backend Environment Variables
Create a `.env` file inside the `/backend` directory:
```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Firebase Admin SDK (For secure server-side token verification)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Mistral AI Integration
MISTRAL_API_KEY=your_mistral_api_key
MISTRAL_MODEL=mistral-large-latest

# Google Cloud / Gmail OAuth Integration
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/gmail/callback

# Security & Encryption
TOKEN_ENCRYPTION_KEY=a_secure_32_character_string_for_aes_256
```

---

## 🛠 Local Development Guide

Follow these steps to get the entire stack running locally on your machine.

### 1. Prerequisites
- **Node.js**: Version 18.x or higher is strictly required.
- **Package Manager**: `npm` is used across the project.
- **Git**: For version control.

### 2. Running the Client Application
Open your terminal at the root of the project:
```bash
# 1. Install all frontend dependencies
npm install

# 2. Start the Vite development server
npm run dev
```
The frontend will compile and become available at `http://localhost:5173`. Hot Module Replacement (HMR) is enabled by default.

### 3. Running the API Backend
Open a **second** terminal tab and navigate into the backend folder:
```bash
# 1. Navigate to the backend folder
cd backend

# 2. Install all backend dependencies
npm install

# 3. Start the Express server using tsx/nodemon
npm run dev
```
The backend server will start on `http://localhost:5000`. It will automatically watch for TypeScript file changes and restart.

---

## 🗄 Supabase Database Schema

To properly run the application, your Supabase PostgreSQL instance must contain the following core structures. (Note: Ensure Row Level Security (RLS) is configured appropriately if queried directly from the client).

### `leads` Table
Stores all prospect data.
- `id` (UUID, Primary Key)
- `business_name` (Text)
- `contact_name` (Text, Nullable)
- `email` (Text)
- `industry` (Text)
- `website` (Text)
- `website_status` (Text) - E.g., "Active", "Missing", "Slow"
- `opportunity` (Text)
- `lead_score` (Integer)
- `email_status` (Text) - E.g., "PENDING", "DRAFTED", "SENT"
- `created_at` (Timestamp)

### `campaigns` Table
Manages outreach configuration.
- `id` (UUID, Primary Key)
- `name` (Text)
- `status` (Text) - E.g., "ACTIVE", "PAUSED"
- `created_at` (Timestamp)

### `emails` Table
Tracks sent communications and thread replies.
- `id` (UUID, Primary Key)
- `lead_id` (UUID, Foreign Key)
- `campaign_id` (UUID, Foreign Key)
- `subject` (Text)
- `body` (Text)
- `thread_id` (Text) - The Google Thread ID for reply tracking
- `status` (Text)
- `sent_at` (Timestamp)

---

## 🔐 Security & Data Privacy

- **Token Encryption**: Google OAuth refresh tokens are encrypted at rest using AES-256 before being stored in the database. The `TOKEN_ENCRYPTION_KEY` environment variable is used as the cipher key.
- **Stateless Auth**: The backend verifies Firebase ID tokens securely using the Firebase Admin SDK on every protected route request.
- **Data Isolation**: All user data, leads, and email drafts are strictly isolated by User ID.

---

## 🤝 Contributing to ClientFlow

We welcome contributions to improve the AI capabilities, frontend UX, or backend stability.

1. **Fork & Clone**: Fork the repository and clone it locally.
2. **Branching**: Create a strictly named feature branch (`git checkout -b feature/your-feature-name` or `bugfix/issue-description`).
3. **Linting**: Ensure your code passes all linting rules by running `npm run lint`.
4. **Committing**: Write clear, descriptive commit messages.
5. **Pull Requests**: Open a pull request against the `main` branch detailing the problem solved and the approach taken.

---

## 📄 Licensing & Legal

Copyright © 2026 ClientFlow AI. 
This software is proprietary. Unauthorized copying, distribution, modification, or public display of this codebase, via any medium, is strictly prohibited. For licensing inquiries, please contact the repository administrators.
