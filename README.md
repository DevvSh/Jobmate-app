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

Before you begin, ensure you have the following installed on your device:

1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

4. **Expo CLI** (for React Native development)
   - Install globally: `npm install -g @expo/cli`

### Step-by-Step Installation Guide

#### Step 1: Clone the Repository
```bash
git clone https://github.com/DevvSh/Jobmate-app.git
cd Jobmate-app
```

#### Step 2: Set Up the Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install backend dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit the `.env` file and add your configuration:
```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

#### Step 3: Set Up the Frontend

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the Expo development server:
```bash
npx expo start --web
```

The frontend will run on `http://localhost:19006`

#### Step 4: Access the Application

- **Web Browser**: Open `http://localhost:19006` in your web browser
- **Mobile Device**: 
  - Install Expo Go app from App Store/Google Play
  - Scan the QR code displayed in your terminal
- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal

### Running the Application

#### For Development:

1. **Start Backend** (Terminal 1):
```bash
cd backend
npm run dev
```

2. **Start Frontend** (Terminal 2):
```bash
cd frontend
npx expo start --web
```

#### For Production Build:

1. **Build Frontend**:
```bash
cd frontend
npx expo build:web
```

### Troubleshooting

#### Common Issues:

1. **Port already in use**:
   - Kill the process using the port: `npx kill-port 5000` or `npx kill-port 19006`
   - Or use different ports in your configuration

2. **Module not found errors**:
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

3. **Expo CLI issues**:
   - Update Expo CLI: `npm install -g @expo/cli@latest`
   - Clear Expo cache: `npx expo start --clear`

4. **Environment variables not loading**:
   - Ensure `.env` file is in the correct directory
   - Restart the development server after making changes

### Additional Setup (Optional)

#### For API Integration:
- **OpenAI API Key**: Sign up at https://platform.openai.com/
- **Supabase**: Create a project at https://supabase.com/

#### For Mobile Development:
- **iOS**: Install Xcode (macOS only)
- **Android**: Install Android Studio and set up Android SDK

### Project Structure Overview

```
jobmate/
├── frontend/                 # React Native/Expo app
│   ├── screens/             # Application screens
│   │   ├── ApplicationsScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── HomeScreen.js
│   │   └── ...
│   ├── App.js              # Main app component
│   ├── package.json        # Frontend dependencies
│   └── ...
├── backend/                # Node.js Express server
│   ├── routes/             # API routes
│   ├── server.js           # Server entry point
│   ├── package.json        # Backend dependencies
│   └── ...
└── README.md              # This file
```

### Need Help?

If you encounter any issues during installation or setup:
1. Check the troubleshooting section above
2. Ensure all prerequisites are properly installed
3. Verify that both frontend and backend servers are running
4. Check the terminal for any error messages

For additional support, please refer to the project documentation or create an issue in the repository.

## License
MIT