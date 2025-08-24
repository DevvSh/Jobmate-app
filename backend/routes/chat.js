const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { OpenAI } = require('openai');

// Initialize OpenAI (in a real app, API key would be in .env)
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (error) {
  console.warn('OpenAI initialization failed. Using mock responses for development.');
}

// Set up multer for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/audio');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'audio-' + uniqueSuffix + '.m4a');
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Text-based chat endpoint
router.post('/message', async (req, res) => {
  try {
    const { message, context, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let response;

    // Use OpenAI if available, otherwise use mock response
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful job application assistant. You help users create resumes, write cover letters, and prepare for interviews." },
          ...context?.map(msg => ({ role: msg.role, content: msg.content })) || [],
          { role: "user", content: message }
        ],
      });

      response = completion.choices[0].message.content;
    } else {
      // Mock response for development without API key
      response = getMockResponse(message);
    }

    // In a real app, save the conversation to the database
    res.status(200).json({
      response,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Voice input endpoint (using Whisper API)
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const filePath = req.file.path;
    let transcription;

    // Use OpenAI Whisper if available, otherwise use mock response
    if (openai) {
      const audioFile = fs.createReadStream(filePath);
      const response = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
      });

      transcription = response.text;
    } else {
      // Mock transcription for development without API key
      transcription = "This is a mock transcription of the audio file.";
    }

    // Clean up the file after processing
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting audio file:', err);
    });

    res.status(200).json({
      transcription,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// Helper function for mock responses during development
function getMockResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('resume')) {
    return "I can help you create a resume! Let's start by gathering some information about your work experience. What was your most recent job title?";
  } else if (lowerMessage.includes('cover letter')) {
    return "Creating a cover letter is a great idea! Do you have a specific job description you're applying for?";
  } else if (lowerMessage.includes('interview')) {
    return "Preparing for interviews is crucial. What role are you interviewing for?";
  } else {
    return "I'm here to help with your job application needs. Would you like to create a resume, write a cover letter, or prepare for interviews?";
  }
}

module.exports = router;