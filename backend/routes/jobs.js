const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');

// Initialize OpenAI (in a real app, API key would be in .env)
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (error) {
  console.warn('OpenAI initialization failed. Using mock responses for development.');
}

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase;

try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
  console.warn('Supabase initialization failed. Using mock data for development.');
}

// Get job listings
router.get('/', async (req, res) => {
  try {
    let jobs = [];
    
    // If Supabase is initialized, fetch jobs from database
    if (supabase) {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      jobs = data;
    } else {
      // Use mock data for development
      jobs = getMockJobs();
    }
    
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Match jobs to user profile using embeddings
router.post('/match', async (req, res) => {
  try {
    const { userProfile, userSkills, userExperience } = req.body;
    
    if (!userProfile) {
      return res.status(400).json({ error: 'User profile data is required' });
    }
    
    let matchedJobs = [];
    
    // If OpenAI is available, use embeddings for matching
    if (openai) {
      // Get user profile embedding
      const userProfileText = `${userProfile.title}. Skills: ${userSkills}. Experience: ${userExperience}`;
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: userProfileText,
      });
      
      const userEmbedding = embeddingResponse.data[0].embedding;
      
      // In a real app, we would:
      // 1. Store job embeddings in the database
      // 2. Perform vector similarity search
      // 3. Return jobs sorted by similarity score
      
      // For the prototype, we'll use mock data and simulate the matching
      const jobs = getMockJobs();
      
      // Simulate matching with random scores (in a real app, this would use vector similarity)
      matchedJobs = jobs.map(job => ({
        ...job,
        matchScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-99
      }));
      
      // Sort by match score
      matchedJobs.sort((a, b) => b.matchScore - a.matchScore);
    } else {
      // Without OpenAI, just return mock jobs with random scores
      const jobs = getMockJobs();
      
      matchedJobs = jobs.map(job => ({
        ...job,
        matchScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-99
      }));
      
      matchedJobs.sort((a, b) => b.matchScore - a.matchScore);
    }
    
    res.status(200).json(matchedJobs);
  } catch (error) {
    console.error('Error matching jobs:', error);
    res.status(500).json({ error: 'Failed to match jobs' });
  }
});

// Helper function for mock job data
function getMockJobs() {
  return [
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'Tech Innovations Inc.',
      location: 'San Francisco, CA',
      description: 'We are looking for a skilled Frontend Developer with experience in React Native and modern JavaScript frameworks.',
      skills: ['React Native', 'JavaScript', 'CSS', 'UI/UX'],
      salary: '$90,000 - $120,000',
      postedDate: '2023-06-15',
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      company: 'Digital Solutions',
      location: 'Remote',
      description: 'Join our team as a Full Stack Engineer working on cutting-edge web applications using Node.js and React.',
      skills: ['Node.js', 'React', 'MongoDB', 'Express'],
      salary: '$100,000 - $130,000',
      postedDate: '2023-06-18',
    },
    {
      id: '3',
      title: 'Mobile Developer',
      company: 'AppWorks',
      location: 'Austin, TX',
      description: 'Seeking a talented Mobile Developer to build innovative applications for iOS and Android platforms.',
      skills: ['React Native', 'iOS', 'Android', 'API Integration'],
      salary: '$85,000 - $115,000',
      postedDate: '2023-06-20',
    },
    {
      id: '4',
      title: 'UI/UX Designer',
      company: 'Creative Minds',
      location: 'New York, NY',
      description: 'Looking for a UI/UX Designer with a strong portfolio and experience in mobile app design.',
      skills: ['UI Design', 'UX Research', 'Figma', 'Adobe XD'],
      salary: '$80,000 - $110,000',
      postedDate: '2023-06-22',
    },
    {
      id: '5',
      title: 'Backend Developer',
      company: 'Data Systems Inc.',
      location: 'Chicago, IL',
      description: 'Backend Developer needed to build robust APIs and services using Node.js and PostgreSQL.',
      skills: ['Node.js', 'PostgreSQL', 'API Design', 'Docker'],
      salary: '$95,000 - $125,000',
      postedDate: '2023-06-25',
    },
  ];
}

module.exports = router;