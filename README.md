# ClientFlow AI Dashboard

ClientFlow AI is a comprehensive, AI-powered lead analysis and cold email outreach platform specifically tailored for web design studios. The application streamlines the outreach process by finding businesses with weak or missing websites, automatically analyzing them, generating highly personalized AI pitches, and sending emails directly via Gmail OAuth.

---

## 🎯 Key Features

### 1. Lead Management & Scoring
- **Automated Website Analysis**: The system evaluates lead websites to detect missing, outdated, slow, or non-responsive setups.
- **Intelligent Lead Scoring**: Prioritizes businesses that are most likely to need web design or development services based on analysis data.
- **Data Import**: Easily import leads via CSV (e.g., `test_leads.csv`).

### 2. AI-Powered Personalization (Mistral AI)
- **Contextual Pitches**: Uses Mistral AI to generate context-rich email pitches based on the prospect's specific industry, location, and website opportunity (e.g., "missing mobile site").
- **Analysis Extraction**: AI parses lead data and extracts 3 bullet points of specific angles/pain points to use in outreach.

### 3. Native Gmail Integration
- **Direct Sending**: Sends emails natively from your own Gmail inbox using OAuth 2.0.
- **High Deliverability**: Bypasses traditional SMTP servers in favor of the Gmail API, mimicking human-paced delivery.
- **Reply Detection**: Built-in monitoring to detect when a prospect replies, automatically pausing the email sequence.

### 4. Modern Dashboard Interface
- **Responsive UI**: Built with React, Vite, and Tailwind CSS.
- **Dark Mode**: Fully supported dark/light theme toggling.
- **Routing**: Client-side routing with TanStack Router.

---

## 🛠 Tech Stack

### Frontend (Client)
- **Framework**: React 19 + Vite
- **Routing & State**: TanStack Router (`@tanstack/react-router`) & TanStack Query (`@tanstack/react-query`)
- **Styling**: Tailwind CSS, shadcn/ui components, `lucide-react` icons
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Firebase Authentication (Google Auth Provider)
- **Charts**: Recharts

### Backend (API Services)
- **Framework**: Node.js with Express & TypeScript
- **Database**: Supabase (PostgreSQL)
- **AI Model**: Mistral AI SDK (`@mistralai/mistralai`) replacing OpenAI. Default model: `mistral-large-latest`.
- **Email API**: Google APIs (`googleapis`) for Gmail OAuth and sending.

---

## 📁 Project Structure

```
ClientFlow/
├── backend/                 # Node.js / Express backend
│   ├── src/
│   │   ├── config/          # Configurations (Env, Mistral, Supabase, Gmail)
│   │   ├── services/        # Core business logic (AI, Gmail, Leads, Campaigns)
│   │   ├── server.ts        # Express server entry point
│   ├── .env                 # Backend environment variables
│   └── package.json         # Backend dependencies
├── src/                     # React Frontend
│   ├── components/          # Reusable UI components (shadcn, layout, dashboard)
│   ├── contexts/            # React Contexts (Auth, Theme)
│   ├── hooks/               # Custom React Hooks
│   ├── lib/                 # Utilities (Firebase init, Supabase client, formatting)
│   ├── routes/              # TanStack File-based Routes
│   ├── services/            # Frontend API clients
│   └── styles.css           # Global Tailwind CSS
├── public/                  # Static assets
├── .env                     # Frontend environment variables
└── package.json             # Frontend dependencies
```

---

## ⚙️ Environment Variables Setup

You will need to configure environment variables for both the **Frontend** and the **Backend**. 

### 1. Frontend (`.env` in root)
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

### 2. Backend (`backend/.env`)
Create a `.env` file in the `backend` directory:
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Firebase Admin SDK (Optional/Used for Server-side verification)
FIREBASE_PROJECT_ID=clientflow-c0667
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Supabase (Database)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Mistral AI
MISTRAL_API_KEY=your_mistral_api_key
MISTRAL_MODEL=mistral-large-latest

# Gmail OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/gmail/callback

# Encryption
TOKEN_ENCRYPTION_KEY=32_character_long_encryption_key
```

---

## 🚀 Installation & Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18+)
- [Git](https://git-scm.com/)
- Supabase Account
- Mistral AI Account
- Google Cloud Console Project (with Gmail API enabled)

### Step 1: Clone the Repository
```bash
git clone https://github.com/ma-nees/ClientFlow.git
cd ClientFlow
```

### Step 2: Setup the Frontend
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173` (or port specified by Vite).*

### Step 3: Setup the Backend
1. Open a new terminal tab and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`.*

---

## 🗄 Database Schema (Supabase)

The core database tables managed by Supabase include:

- **`leads`**: Stores prospect information (business name, contact, industry, website, opportunity, score, email status).
- **`campaigns`**: Stores email outreach campaigns and their settings.
- **`emails`**: Tracks individual emails sent, including draft content, subject, thread IDs, and delivery status.

*Note: The frontend uses Firebase for client-side Auth, while business logic and relational data are stored in Supabase.*

---

## 📜 Available Scripts

### Root Directory (Frontend)
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs ESLint to catch code issues.
- `npm run format`: Formats code with Prettier.

### Backend Directory
- `npm run dev`: Starts the Node.js server using `nodemon` and `tsx`.
- `npm run build`: Compiles TypeScript to JavaScript.
- `npm start`: Runs the compiled server from `dist/server.js`.
- `npm run typecheck`: Runs TypeScript compiler without emitting files.

---

## 🤝 Contributing
1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m "Add your feature"`
3. Push the branch: `git push origin feature/your-feature-name`
4. Open a Pull Request.

## 📄 License
This project is proprietary and confidential. Unauthorized copying, distribution, or usage is strictly prohibited.
