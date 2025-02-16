const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors()); // Enable cross-origin requests
app.use(express.json()); // Parse JSON payloads

const uploadFolder = path.join(__dirname, 'images');

// Multer storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    let prefix = '';
    if (file.originalname.toLowerCase().includes('top')) prefix = 'top_';
    else if (file.originalname.toLowerCase().includes('bottom')) prefix = 'bottom_';
    else if (file.originalname.toLowerCase().includes('shoes')) prefix = 'shoes_';

    const uniqueName = `${prefix}${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});


const upload = multer({ storage });

// Serve static files
app.use('/images', express.static(uploadFolder));

// Endpoint to handle file uploads
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const filePath = `/images/${req.file.filename}`;
  res.json({ filePath });
});

// New endpoint to return all images as JSON
app.get('/images', (req, res) => {
  fs.readdir(uploadFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve images' });
    }
    const filePaths = files.map(file => `/images/${file}`);
    res.json(filePaths);
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
