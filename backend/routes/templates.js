const express = require('express');
const router = express.Router();

// Get all available resume templates
router.get('/', (req, res) => {
  try {
    const templates = getResumeTemplates();
    res.status(200).json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get specific template by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const templates = getResumeTemplates();
    const template = templates.find(t => t.id === id);
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.status(200).json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// Generate resume with specific template
router.post('/:id/generate', (req, res) => {
  try {
    const { id } = req.params;
    const { userData } = req.body;
    
    if (!userData) {
      return res.status(400).json({ error: 'User data is required' });
    }
    
    const templates = getResumeTemplates();
    const template = templates.find(t => t.id === id);
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    const generatedResume = applyTemplate(userData, template);
    
    res.status(200).json({
      message: 'Resume generated successfully',
      template: template,
      resume: generatedResume
    });
  } catch (error) {
    console.error('Error generating resume with template:', error);
    res.status(500).json({ error: 'Failed to generate resume' });
  }
});

function getResumeTemplates() {
  return [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean and professional layout perfect for corporate positions',
      category: 'business',
      preview: '/templates/professional-preview.png',
      colors: {
        primary: '#2c3e50',
        secondary: '#34495e',
        accent: '#3498db',
        text: '#2c3e50',
        background: '#ffffff'
      },
      fonts: {
        heading: 'Arial, sans-serif',
        body: 'Arial, sans-serif'
      },
      layout: {
        type: 'single-column',
        sections: ['header', 'summary', 'experience', 'education', 'skills']
      }
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary design with clean lines and modern typography',
      category: 'creative',
      preview: '/templates/modern-preview.png',
      colors: {
        primary: '#1a1a1a',
        secondary: '#666666',
        accent: '#ff6b6b',
        text: '#333333',
        background: '#ffffff'
      },
      fonts: {
        heading: 'Helvetica, sans-serif',
        body: 'Helvetica, sans-serif'
      },
      layout: {
        type: 'two-column',
        sections: ['header', 'summary', 'experience', 'skills', 'education']
      }
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Bold and creative design for artistic and design positions',
      category: 'creative',
      preview: '/templates/creative-preview.png',
      colors: {
        primary: '#8e44ad',
        secondary: '#9b59b6',
        accent: '#e74c3c',
        text: '#2c3e50',
        background: '#ffffff'
      },
      fonts: {
        heading: 'Georgia, serif',
        body: 'Open Sans, sans-serif'
      },
      layout: {
        type: 'creative-grid',
        sections: ['header', 'summary', 'skills', 'experience', 'education', 'portfolio']
      }
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and clean design focusing on content',
      category: 'simple',
      preview: '/templates/minimal-preview.png',
      colors: {
        primary: '#000000',
        secondary: '#666666',
        accent: '#000000',
        text: '#333333',
        background: '#ffffff'
      },
      fonts: {
        heading: 'Times New Roman, serif',
        body: 'Times New Roman, serif'
      },
      layout: {
        type: 'single-column',
        sections: ['header', 'experience', 'education', 'skills']
      }
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Sophisticated design for senior-level positions',
      category: 'business',
      preview: '/templates/executive-preview.png',
      colors: {
        primary: '#1e3a8a',
        secondary: '#3b82f6',
        accent: '#fbbf24',
        text: '#1f2937',
        background: '#ffffff'
      },
      fonts: {
        heading: 'Garamond, serif',
        body: 'Garamond, serif'
      },
      layout: {
        type: 'executive-style',
        sections: ['header', 'executive-summary', 'leadership', 'experience', 'education', 'achievements']
      }
    },
    {
      id: 'tech',
      name: 'Tech',
      description: 'Modern design optimized for technology professionals',
      category: 'technology',
      preview: '/templates/tech-preview.png',
      colors: {
        primary: '#0f172a',
        secondary: '#475569',
        accent: '#06b6d4',
        text: '#334155',
        background: '#ffffff'
      },
      fonts: {
        heading: 'Roboto, sans-serif',
        body: 'Roboto, sans-serif'
      },
      layout: {
        type: 'tech-grid',
        sections: ['header', 'summary', 'technical-skills', 'experience', 'projects', 'education']
      }
    }
  ];
}

function applyTemplate(userData, template) {
  const baseResume = {
    personalInfo: {
      name: userData.name || 'John Doe',
      email: userData.email || 'john.doe@email.com',
      phone: userData.phone || '+1 (555) 123-4567',
      location: userData.location || 'City, State',
      linkedin: userData.linkedin || '',
      website: userData.website || ''
    },
    summary: userData.summary || 'Experienced professional with strong background in technology and innovation.',
    experience: userData.experience || [{
      company: 'Tech Company',
      position: 'Software Developer',
      duration: '2020-2023',
      description: 'Developed and maintained web applications using modern technologies.'
    }],
    education: userData.education || [{
      institution: 'University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      year: '2020'
    }],
    skills: userData.skills || ['JavaScript', 'React', 'Node.js'],
    achievements: userData.achievements || ['Increased team productivity by 25%', 'Led successful project delivery']
  };

  // Apply template-specific formatting
  switch (template.id) {
    case 'executive':
      baseResume.executiveSummary = userData.executiveSummary || baseResume.summary;
      baseResume.leadership = userData.leadership || ['Led cross-functional teams', 'Managed strategic initiatives'];
      break;
    case 'tech':
      baseResume.technicalSkills = {
        languages: userData.languages || ['JavaScript', 'Python', 'Java'],
        frameworks: userData.frameworks || ['React', 'Node.js', 'Express'],
        tools: userData.tools || ['Git', 'Docker', 'AWS'],
        databases: userData.databases || ['MongoDB', 'PostgreSQL']
      };
      baseResume.projects = userData.projects || [{
        name: 'Sample Project',
        description: 'Built a full-stack web application',
        technologies: ['React', 'Node.js', 'MongoDB'],
        link: 'https://github.com/username/project'
      }];
      break;
    case 'creative':
      baseResume.portfolio = userData.portfolio || [{
        title: 'Creative Project',
        description: 'Innovative design solution',
        link: 'https://portfolio.com/project'
      }];
      break;
  }

  return {
    ...baseResume,
    template: template,
    generatedAt: new Date().toISOString()
  };
}

module.exports = router;