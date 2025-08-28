const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { OpenAI } = require('openai');

// Initialize OpenAI
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (error) {
  console.warn('OpenAI initialization failed. Using mock responses for development.');
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'resume-' + uniqueSuffix + ext);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  }
});

// Upload resume
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    let extractedText = '';

    // Parse the file based on its type
    if (fileExt === '.pdf') {
      const pdfData = await fs.promises.readFile(filePath);
      const pdfResult = await pdfParse(pdfData);
      extractedText = pdfResult.text;
    } else if (fileExt === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
    }

    // Process the extracted text using AI to structure the data
    let structuredData = null;
    let skills = [];
    let experience = [];
    
    if (openai && extractedText.trim()) {
      try {
        // Use OpenAI to extract structured data from resume
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: "You are a resume parser. Extract structured information from the resume text and return it as JSON with fields: name, email, phone, skills (array), experience (array with company, position, duration, description), education (array), summary."
          }, {
            role: "user",
            content: `Parse this resume text: ${extractedText}`
          }]
        });
        
        structuredData = JSON.parse(completion.choices[0].message.content);
        skills = structuredData.skills || [];
        experience = structuredData.experience || [];
      } catch (aiError) {
        console.error('AI parsing error:', aiError);
        // Fallback to basic keyword extraction
        skills = extractSkillsFromText(extractedText);
        experience = extractExperienceFromText(extractedText);
      }
    } else {
      // Fallback parsing without AI
      skills = extractSkillsFromText(extractedText);
      experience = extractExperienceFromText(extractedText);
    }

    res.status(200).json({
      message: 'Resume uploaded and parsed successfully',
      fileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
      extractedText,
      structuredData,
      skills,
      experience,
    });
  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ error: 'Failed to process resume' });
  }
});

// Generate resume from data
router.post('/generate', async (req, res) => {
  try {
    const { userData, jobDescription, template = 'professional' } = req.body;

    if (!userData) {
      return res.status(400).json({ error: 'User data is required' });
    }

    let generatedResume = null;
    
    if (openai) {
      try {
        // Use OpenAI to generate a tailored resume
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: `You are a professional resume writer. Create a tailored resume based on the user data and job description. Return structured JSON with sections: personalInfo, summary, experience, education, skills, achievements. Use the ${template} template style.`
          }, {
            role: "user",
            content: `User Data: ${JSON.stringify(userData)}\n\nJob Description: ${jobDescription || 'General position'}`
          }]
        });
        
        generatedResume = JSON.parse(completion.choices[0].message.content);
      } catch (aiError) {
        console.error('AI generation error:', aiError);
        generatedResume = generateMockResume(userData, template);
      }
    } else {
      generatedResume = generateMockResume(userData, template);
    }

    res.status(200).json({
      message: 'Resume generated successfully',
      resume: generatedResume,
      template,
      documentUrl: '/generated/sample-resume.pdf',
    });
  } catch (error) {
    console.error('Error generating resume:', error);
    res.status(500).json({ error: 'Failed to generate resume' });
  }
});

// Match resume to job descriptions
router.post('/match', async (req, res) => {
  try {
    const { resumeData, jobDescriptions } = req.body;
    
    if (!resumeData || !jobDescriptions) {
      return res.status(400).json({ error: 'Resume data and job descriptions are required' });
    }
    
    let matchResults = [];
    
    if (openai) {
      try {
        // Use OpenAI to analyze resume-job matches
        for (const job of jobDescriptions) {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{
              role: "system",
              content: "You are a job matching expert. Analyze how well a resume matches a job description. Return JSON with: matchScore (0-100), strengths (array), gaps (array), recommendations (array)."
            }, {
              role: "user",
              content: `Resume: ${JSON.stringify(resumeData)}\n\nJob: ${JSON.stringify(job)}`
            }]
          });
          
          const analysis = JSON.parse(completion.choices[0].message.content);
          matchResults.push({
            jobId: job.id,
            jobTitle: job.title,
            company: job.company,
            ...analysis
          });
        }
      } catch (aiError) {
        console.error('AI matching error:', aiError);
        matchResults = generateMockMatches(resumeData, jobDescriptions);
      }
    } else {
      matchResults = generateMockMatches(resumeData, jobDescriptions);
    }
    
    // Sort by match score
    matchResults.sort((a, b) => b.matchScore - a.matchScore);
    
    res.status(200).json({
      matches: matchResults,
      totalJobs: jobDescriptions.length
    });
  } catch (error) {
    console.error('Error matching resume:', error);
    res.status(500).json({ error: 'Failed to match resume' });
  }
});

// Helper functions
function extractSkillsFromText(text) {
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML', 'CSS',
    'SQL', 'MongoDB', 'PostgreSQL', 'Git', 'Docker', 'AWS', 'Azure',
    'Machine Learning', 'Data Analysis', 'Project Management', 'Agile',
    'Scrum', 'Leadership', 'Communication', 'Problem Solving'
  ];
  
  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

function extractExperienceFromText(text) {
  // Basic regex to find potential job titles and companies
  const lines = text.split('\n');
  const experience = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/\b(developer|engineer|manager|analyst|designer|consultant)\b/i)) {
      experience.push({
        position: line,
        company: 'Company Name',
        duration: '2020-2023',
        description: 'Job responsibilities and achievements'
      });
    }
  }
  
  return experience.slice(0, 3); // Return max 3 experiences
}

function generateMockResume(userData, template) {
  return {
    personalInfo: {
      name: userData.name || 'John Doe',
      email: userData.email || 'john.doe@email.com',
      phone: userData.phone || '+1 (555) 123-4567',
      location: userData.location || 'City, State'
    },
    summary: 'Experienced professional with strong background in technology and innovation.',
    experience: userData.experience || [{
      company: 'Tech Company',
      position: 'Software Developer',
      duration: '2020-2023',
      description: 'Developed and maintained web applications'
    }],
    education: userData.education || [{
      institution: 'University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      year: '2020'
    }],
    skills: userData.skills || ['JavaScript', 'React', 'Node.js'],
    achievements: ['Increased team productivity by 25%', 'Led successful project delivery']
  };
}

function generateMockMatches(resumeData, jobDescriptions) {
  return jobDescriptions.map(job => ({
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    matchScore: Math.floor(Math.random() * 30) + 70,
    strengths: ['Relevant experience', 'Strong technical skills'],
    gaps: ['Could improve in specific domain knowledge'],
    recommendations: ['Highlight relevant projects', 'Emphasize leadership experience']
  }));
}

// Analyze uploaded resume with detailed feedback
router.post('/analyze', async (req, res) => {
  try {
    const { resumeData, jobType, targetRole } = req.body;
    
    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' });
    }
    
    let analysis = {};
    
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: `You are an expert resume analyst and career coach. Analyze the resume comprehensively and provide detailed feedback in JSON format with the following structure:
            {
              "overallScore": number (0-100),
              "strengths": ["strength1", "strength2"],
              "weaknesses": ["weakness1", "weakness2"],
              "suggestions": [
                {
                  "category": "Content|Format|Keywords|ATS",
                  "priority": "High|Medium|Low",
                  "issue": "description of issue",
                  "solution": "specific actionable solution",
                  "example": "concrete example if applicable"
                }
              ],
              "missingKeywords": ["keyword1", "keyword2"],
              "atsCompatibility": number (0-100),
              "sectionAnalysis": {
                "summary": "feedback on professional summary",
                "experience": "feedback on work experience",
                "skills": "feedback on skills section",
                "education": "feedback on education section"
              }
            }`
          }, {
            role: "user",
            content: `Analyze this resume for a ${targetRole || jobType || 'general'} position. Resume data: ${JSON.stringify(resumeData)}`
          }]
        });
        
        analysis = JSON.parse(completion.choices[0].message.content);
        
      } catch (aiError) {
        console.error('AI analysis error:', aiError);
        // Fallback analysis
        analysis = {
          overallScore: 75,
          strengths: ['Clear work history', 'Relevant experience', 'Good skill set'],
          weaknesses: ['Lacks quantified achievements', 'Missing keywords', 'Generic summary'],
          suggestions: [
            {
              category: 'Content',
              priority: 'High',
              issue: 'Missing quantified achievements',
              solution: 'Add specific numbers, percentages, and metrics to demonstrate impact',
              example: 'Instead of "Improved sales" write "Increased sales by 25% over 6 months"'
            },
            {
              category: 'Keywords',
              priority: 'High',
              issue: 'Insufficient industry keywords',
              solution: 'Include more role-specific keywords from job descriptions',
              example: 'Add technical skills and industry buzzwords relevant to your field'
            },
            {
              category: 'Format',
              priority: 'Medium',
              issue: 'Professional summary needs strengthening',
              solution: 'Write a compelling 2-3 line summary highlighting your unique value proposition',
              example: 'Focus on your biggest achievements and what makes you stand out'
            }
          ],
          missingKeywords: ['leadership', 'project management', 'data analysis'],
          atsCompatibility: 70,
          sectionAnalysis: {
            summary: 'Consider making your professional summary more impactful and specific',
            experience: 'Add more quantified achievements and specific accomplishments',
            skills: 'Include more technical and soft skills relevant to your target role',
            education: 'Education section is adequate but could include relevant coursework or certifications'
          }
        };
      }
    } else {
      // Mock analysis for development
      analysis = {
        overallScore: 72,
        strengths: ['Professional experience', 'Clear structure', 'Relevant qualifications'],
        weaknesses: ['Needs more metrics', 'Missing keywords', 'Generic content'],
        suggestions: [
          {
            category: 'Content',
            priority: 'High',
            issue: 'Lack of quantified achievements',
            solution: 'Add specific metrics and numbers to demonstrate your impact',
            example: 'Replace "Managed team" with "Managed team of 8 developers, reducing project delivery time by 30%"'
          },
          {
            category: 'ATS',
            priority: 'High',
            issue: 'Low keyword density',
            solution: 'Include more industry-specific keywords throughout your resume',
            example: 'Research job postings in your field and incorporate relevant terminology'
          }
        ],
        missingKeywords: ['agile', 'scrum', 'leadership', 'analytics'],
        atsCompatibility: 68,
        sectionAnalysis: {
          summary: 'Professional summary should be more compelling and specific to your achievements',
          experience: 'Work experience needs more quantified results and specific accomplishments',
          skills: 'Skills section should include both technical and soft skills with proficiency levels',
          education: 'Education section is complete but could benefit from relevant projects or honors'
        }
      };
    }
    
    res.status(200).json({
      ...analysis,
      timestamp: new Date(),
      targetRole: targetRole || jobType || 'general'
    });
    
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

// Get improvement suggestions based on specific criteria
router.post('/improve', async (req, res) => {
  try {
    const { resumeText, targetJob, improvementAreas } = req.body;
    
    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }
    
    let improvements = {};
    
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: `You are a professional resume writer and career coach. Provide specific, actionable improvements for the resume. Return JSON with:
            {
              "rewrittenSections": {
                "summary": "improved professional summary",
                "experience": ["improved bullet point 1", "improved bullet point 2"],
                "skills": ["categorized skills with proficiency"]
              },
              "addedContent": {
                "achievements": ["quantified achievement 1", "quantified achievement 2"],
                "keywords": ["relevant keyword 1", "relevant keyword 2"]
              },
              "formatting": ["formatting suggestion 1", "formatting suggestion 2"]
            }`
          }, {
            role: "user",
            content: `Improve this resume for a ${targetJob || 'general'} position. Focus on: ${improvementAreas?.join(', ') || 'overall improvement'}. Resume: ${resumeText}`
          }]
        });
        
        improvements = JSON.parse(completion.choices[0].message.content);
        
      } catch (aiError) {
        console.error('AI improvement error:', aiError);
        improvements = {
          rewrittenSections: {
            summary: 'Results-driven professional with proven track record of delivering exceptional outcomes and driving organizational success through innovative solutions and strategic thinking.',
            experience: [
              'Led cross-functional team of 12 members, resulting in 40% improvement in project delivery timelines',
              'Implemented data-driven strategies that increased operational efficiency by 35% and reduced costs by $200K annually',
              'Developed and executed comprehensive training programs, improving team productivity by 25%'
            ],
            skills: ['Technical Skills: Python, JavaScript, SQL, AWS', 'Leadership: Team Management, Strategic Planning', 'Analytics: Data Analysis, Performance Metrics']
          },
          addedContent: {
            achievements: [
              'Increased revenue by 30% through implementation of new customer acquisition strategies',
              'Reduced operational costs by 20% while maintaining service quality standards',
              'Mentored 15+ junior team members, with 80% receiving promotions within 18 months'
            ],
            keywords: ['project management', 'stakeholder engagement', 'process optimization', 'team leadership']
          },
          formatting: [
            'Use consistent bullet points and formatting throughout',
            'Ensure proper spacing and alignment for better readability',
            'Use action verbs to start each bullet point',
            'Keep bullet points concise (1-2 lines maximum)'
          ]
        };
      }
    } else {
      improvements = {
        rewrittenSections: {
          summary: 'Dynamic professional with expertise in driving results and leading high-performing teams to achieve organizational objectives.',
          experience: [
            'Managed team of 10+ professionals, achieving 95% project success rate',
            'Streamlined processes resulting in 25% efficiency improvement',
            'Collaborated with stakeholders to deliver solutions exceeding expectations'
          ],
          skills: ['Core Competencies: Leadership, Analysis, Communication', 'Technical: Various tools and platforms', 'Soft Skills: Problem-solving, Adaptability']
        },
        addedContent: {
          achievements: [
            'Delivered projects 15% ahead of schedule consistently',
            'Improved customer satisfaction scores by 22%',
            'Reduced operational expenses by $150K annually'
          ],
          keywords: ['leadership', 'project management', 'analysis', 'optimization']
        },
        formatting: [
          'Use consistent formatting throughout the document',
          'Implement clear section headers',
          'Ensure proper spacing and alignment'
        ]
      };
    }
    
    res.status(200).json({
      improvements,
      targetJob: targetJob || 'general',
      timestamp: new Date()
    });
    
  } catch (error) {
    console.error('Error generating improvements:', error);
    res.status(500).json({ error: 'Failed to generate improvements' });
  }
});

module.exports = router;