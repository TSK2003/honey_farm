const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const { createUpload } = require('../middleware/upload');

// Upload image
router.post('/:folder', authenticateAdmin, (req, res) => {
  const folder = req.params.folder || 'general';
  const upload = createUpload(folder);

  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const url = `/uploads/${folder}/${req.file.filename}`;
    res.json({ url, filename: req.file.filename });
  });
});

// Upload multiple images
router.post('/:folder/multiple', authenticateAdmin, (req, res) => {
  const folder = req.params.folder || 'general';
  const upload = createUpload(folder);

  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    const urls = req.files.map(f => ({
      url: `/uploads/${folder}/${f.filename}`,
      filename: f.filename
    }));
    res.json(urls);
  });
});

module.exports = router;
