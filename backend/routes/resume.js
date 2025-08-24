const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

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

    // Process the extracted text (in a real app, this would use AI to structure the data)
    // For now, we'll just return the raw text
    res.status(200).json({
      message: 'Resume uploaded and parsed successfully',
      fileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
      extractedText,
    });
  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ error: 'Failed to process resume' });
  }
});

// Generate resume from data
router.post('/generate', async (req, res) => {
  try {
    const { userData, jobDescription } = req.body;

    if (!userData) {
      return res.status(400).json({ error: 'User data is required' });
    }

    // In a real app, this would use OpenAI to generate a tailored resume
    // For the prototype, we'll just return a success message
    res.status(200).json({
      message: 'Resume generated successfully',
      // This would be a URL to the generated document in a real app
      documentUrl: '/generated/sample-resume.pdf',
    });
  } catch (error) {
    console.error('Error generating resume:', error);
    res.status(500).json({ error: 'Failed to generate resume' });
  }
});

module.exports = router;