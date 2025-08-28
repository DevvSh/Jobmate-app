const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Get all resumes
router.get('/', (req, res) => {
  res.json({ message: 'Get all resumes' });
});

// Get single resume
router.get('/:id', (req, res) => {
  res.json({ message: `Get resume with id ${req.params.id}` });
});

// Upload resume
router.post('/upload', upload.single('resume'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Process the uploaded file (in a real app, you'd parse the resume here)
    res.json({ 
      message: 'Resume uploaded successfully',
      file: req.file
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ message: 'Error uploading resume' });
  }
});

// Delete resume
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete resume with id ${req.params.id}` });
});

module.exports = router;