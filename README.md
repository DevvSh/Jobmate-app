# Jobmate - Mobile-First Job Application Assistant

Jobmate is a mobile-first application designed to help users create tailored resumes and cover letters, track job applications, and match with suitable job opportunities.

## Features

- **Resume Upload & Creation**: Upload existing resumes (PDF/DOCX) or create from scratch
- **Conversational Interface**: Chat-based interface with text and voice input
- **AI-Powered Generation**: GPT-4 powered resume and cover letter generation
- **Job Matching**: Smart job matching using OpenAI embeddings
- **Document Export**: Generate polished PDF/DOCX documents

## Tech Stack

### Frontend
- React Native / Expo
- React Navigation
- Expo Document Picker
- Voice input with Expo AV and OpenAI Whisper

### Backend
- Node.js with Express
- OpenAI API integration (GPT-4, Whisper)
- Document parsing (pdf.js, mammoth.js)
- Document generation (python-docx, docx2pdf)

### Database
- Supabase (PostgreSQL)

### Deployment
- Frontend: Expo/Vercel
- Backend: Render/Railway

## Project Structure

```
jobmate/
├── frontend/           # React Native/Expo app
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens
│   ├── services/       # API services
│   └── App.js          # Main app component
├── backend/            # Node.js Express server
│   ├── controllers/    # Request handlers
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── server.js       # Server entry point
└── docs/               # Documentation
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Expo CLI
- OpenAI API key
- Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies for frontend and backend
3. Set up environment variables
4. Run the development servers

```bash
# Frontend
cd frontend
npm install
npm start

# Backend
cd backend
npm install
npm run dev
```

## License
MIT