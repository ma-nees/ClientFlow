# ClientFlow AI

ClientFlow AI is an AI-powered lead analysis and cold email outreach platform specifically built for web design studios. It helps you automatically detect businesses with weak or missing websites, generate highly personalized AI pitches using Mistral AI, and send them seamlessly from your own Gmail account.

## Features

- **Lead Scoring & Analysis**: Automatically evaluate businesses to identify those most likely to need web design services.
- **AI-Powered Personalization**: Generate context-rich email pitches based on the prospect's industry, location, and current website status using Mistral AI.
- **Native Gmail Integration**: Send emails directly from your Gmail inbox for high deliverability, with built-in reply detection to pause sequences automatically.
- **Modern & Fast Dashboard**: Built with React, Vite, and TanStack Router for a seamless, responsive user experience.
- **Secure Backend**: Node.js and Express backend backed by Supabase for data storage and Firebase for authentication.

## Tech Stack

**Frontend:**
- [React](https://reactjs.org/) & [Vite](https://vitejs.dev/)
- [TanStack Router](https://tanstack.com/router) & [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- [Firebase Auth](https://firebase.google.com/products/auth) (Google Sign-in)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- [Supabase](https://supabase.com/) (PostgreSQL & Vector store)
- [Mistral AI](https://mistral.ai/) (LLM for pitch generation)
- [Gmail API](https://developers.google.com/gmail/api)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- Supabase Project credentials
- Mistral AI API Key
- Firebase Project for Google Auth
- Google Cloud Console Project for Gmail API OAuth

### Environment Setup

1. Copy `.env.example` to `.env` in both the root folder and the `backend` folder.
2. Fill in the required environment variables:
   - `MISTRAL_API_KEY`: Your Mistral API Key.
   - `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`: Supabase database credentials.
   - `FIREBASE_...`: Firebase config for client-side Auth.
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: For Gmail OAuth integration.

### Installation & Running Locally

1. Install dependencies for the frontend:
   ```sh
   npm install
   ```

2. Run the frontend development server:
   ```sh
   npm run dev
   ```

3. Open a new terminal, navigate to the `backend` folder, and install dependencies:
   ```sh
   cd backend
   npm install
   ```

4. Run the backend development server:
   ```sh
   npm run dev
   ```

## Contributing

1. Create your feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is proprietary and confidential.
