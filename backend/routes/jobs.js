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

// Match jobs to user profile using advanced scoring system
router.post('/match', async (req, res) => {
  try {
    const { userProfile, userSkills = [], userExperience = [], preferences = {} } = req.body;
    
    if (!userProfile) {
      return res.status(400).json({ error: 'User profile data is required' });
    }
    
    let matchedJobs = [];
    const jobs = getMockJobs();
    
    // If OpenAI is available, use AI-enhanced matching
    if (openai) {
      try {
        // Get user profile embedding for semantic matching
        const userProfileText = `${userProfile.title || ''}. Skills: ${Array.isArray(userSkills) ? userSkills.join(', ') : userSkills}. Experience: ${Array.isArray(userExperience) ? userExperience.map(exp => `${exp.position} at ${exp.company}`).join(', ') : userExperience}`;
        
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: userProfileText,
        });
        
        const userEmbedding = embeddingResponse.data[0].embedding;
        
        // Calculate comprehensive match scores for each job
        matchedJobs = await Promise.all(jobs.map(async (job) => {
          const matchScore = await calculateJobMatchScore(job, {
            userProfile,
            userSkills,
            userExperience,
            preferences,
            userEmbedding
          }, openai);
          
          return {
            ...job,
            matchScore: Math.round(matchScore),
            matchDetails: getMatchDetails(job, { userSkills, userExperience, preferences })
          };
        }));
      } catch (aiError) {
        console.error('AI matching error, falling back to rule-based matching:', aiError);
        // Fallback to rule-based matching
        matchedJobs = jobs.map(job => {
          const matchScore = calculateRuleBasedMatchScore(job, { userProfile, userSkills, userExperience, preferences });
          return {
            ...job,
            matchScore: Math.round(matchScore),
            matchDetails: getMatchDetails(job, { userSkills, userExperience, preferences })
          };
        });
      }
    } else {
      // Rule-based matching without AI
      matchedJobs = jobs.map(job => {
        const matchScore = calculateRuleBasedMatchScore(job, { userProfile, userSkills, userExperience, preferences });
        return {
          ...job,
          matchScore: Math.round(matchScore),
          matchDetails: getMatchDetails(job, { userSkills, userExperience, preferences })
        };
      });
    }
    
    // Sort by match score (highest first)
    matchedJobs.sort((a, b) => b.matchScore - a.matchScore);
    
    res.status(200).json(matchedJobs);
  } catch (error) {
    console.error('Error matching jobs:', error);
    res.status(500).json({ error: 'Failed to match jobs' });
  }
});

// Advanced job scoring with AI assistance
async function calculateJobMatchScore(job, userData, openai) {
  const { userProfile, userSkills, userExperience, preferences, userEmbedding } = userData;
  
  try {
    // Get job embedding for semantic similarity
    const jobText = `${job.title}. ${job.description}. Required skills: ${job.skills.join(', ')}`;
    const jobEmbeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: jobText,
    });
    
    const jobEmbedding = jobEmbeddingResponse.data[0].embedding;
    
    // Calculate cosine similarity between user and job embeddings
    const semanticScore = cosineSimilarity(userEmbedding, jobEmbedding) * 100;
    
    // Combine with rule-based scoring
    const ruleBasedScore = calculateRuleBasedMatchScore(job, userData);
    
    // Weighted combination: 60% semantic, 40% rule-based
    return (semanticScore * 0.6) + (ruleBasedScore * 0.4);
  } catch (error) {
    console.error('Error in AI-enhanced scoring:', error);
    // Fallback to rule-based scoring
    return calculateRuleBasedMatchScore(job, userData);
  }
}

// Rule-based matching algorithm
function calculateRuleBasedMatchScore(job, userData) {
  const { userProfile, userSkills = [], userExperience = [], preferences = {} } = userData;
  let score = 0;
  
  // Skills matching (40% weight)
  const skillsScore = calculateSkillsMatch(job.skills, userSkills);
  score += skillsScore * 0.4;
  
  // Experience level matching (25% weight)
  const experienceScore = calculateExperienceMatch(job, userExperience);
  score += experienceScore * 0.25;
  
  // Location preference (15% weight)
  const locationScore = calculateLocationMatch(job.location, preferences.location);
  score += locationScore * 0.15;
  
  // Salary expectation (10% weight)
  const salaryScore = calculateSalaryMatch(job.salary, preferences.salaryRange);
  score += salaryScore * 0.1;
  
  // Job title relevance (10% weight)
  const titleScore = calculateTitleMatch(job.title, userProfile.title);
  score += titleScore * 0.1;
  
  return Math.min(score, 100); // Cap at 100
}

// Helper functions for scoring
function calculateSkillsMatch(jobSkills, userSkills) {
  if (!jobSkills || !userSkills || userSkills.length === 0) return 50;
  
  const jobSkillsLower = jobSkills.map(skill => skill.toLowerCase());
  const userSkillsLower = userSkills.map(skill => skill.toLowerCase());
  
  const matchedSkills = jobSkillsLower.filter(skill => 
    userSkillsLower.some(userSkill => 
      userSkill.includes(skill) || skill.includes(userSkill)
    )
  );
  
  return (matchedSkills.length / jobSkillsLower.length) * 100;
}

function calculateExperienceMatch(job, userExperience) {
  if (!userExperience || userExperience.length === 0) return 30;
  
  // Calculate years of experience
  const totalYears = userExperience.reduce((total, exp) => {
    if (exp.duration) {
      const years = parseFloat(exp.duration.match(/\d+/)?.[0] || 0);
      return total + years;
    }
    return total + 1; // Default 1 year if no duration specified
  }, 0);
  
  // Score based on experience level
  if (totalYears >= 5) return 90;
  if (totalYears >= 3) return 80;
  if (totalYears >= 1) return 70;
  return 50;
}

function calculateLocationMatch(jobLocation, preferredLocation) {
  if (!preferredLocation) return 75; // Neutral score if no preference
  if (!jobLocation) return 50;
  
  const jobLoc = jobLocation.toLowerCase();
  const prefLoc = preferredLocation.toLowerCase();
  
  if (jobLoc.includes('remote') || prefLoc.includes('remote')) return 100;
  if (jobLoc.includes(prefLoc) || prefLoc.includes(jobLoc)) return 95;
  
  // Check for same state/country
  const jobParts = jobLoc.split(',').map(part => part.trim());
  const prefParts = prefLoc.split(',').map(part => part.trim());
  
  if (jobParts.some(part => prefParts.includes(part))) return 70;
  
  return 30;
}

function calculateSalaryMatch(jobSalary, preferredSalaryRange) {
  if (!preferredSalaryRange || !jobSalary) return 75;
  
  // Extract salary numbers (simplified)
  const jobSalaryNumbers = jobSalary.match(/\d+/g)?.map(Number) || [];
  if (jobSalaryNumbers.length === 0) return 75;
  
  const jobMin = Math.min(...jobSalaryNumbers) * 1000;
  const jobMax = Math.max(...jobSalaryNumbers) * 1000;
  const jobAvg = (jobMin + jobMax) / 2;
  
  const { min = 0, max = Infinity } = preferredSalaryRange;
  
  if (jobAvg >= min && jobAvg <= max) return 100;
  if (jobMin <= max && jobMax >= min) return 80; // Partial overlap
  
  return 40;
}

function calculateTitleMatch(jobTitle, userTitle) {
  if (!userTitle || !jobTitle) return 50;
  
  const jobTitleLower = jobTitle.toLowerCase();
  const userTitleLower = userTitle.toLowerCase();
  
  if (jobTitleLower === userTitleLower) return 100;
  if (jobTitleLower.includes(userTitleLower) || userTitleLower.includes(jobTitleLower)) return 85;
  
  // Check for common keywords
  const commonKeywords = ['developer', 'engineer', 'designer', 'manager', 'analyst', 'specialist'];
  const jobKeywords = commonKeywords.filter(keyword => jobTitleLower.includes(keyword));
  const userKeywords = commonKeywords.filter(keyword => userTitleLower.includes(keyword));
  
  const matchedKeywords = jobKeywords.filter(keyword => userKeywords.includes(keyword));
  if (matchedKeywords.length > 0) return 70;
  
  return 30;
}

function getMatchDetails(job, userData) {
  const { userSkills = [], userExperience = [], preferences = {} } = userData;
  
  const skillsMatch = calculateSkillsMatch(job.skills, userSkills);
  const experienceMatch = calculateExperienceMatch(job, userExperience);
  const locationMatch = calculateLocationMatch(job.location, preferences.location);
  
  return {
    skillsMatch: Math.round(skillsMatch),
    experienceMatch: Math.round(experienceMatch),
    locationMatch: Math.round(locationMatch),
    matchedSkills: job.skills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    )
  };
}

// Cosine similarity function for embeddings
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

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