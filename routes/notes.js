const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const auth = require('../middleware/auth');
const router = express.Router();
const notes = [];
const uploading_dir = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploading_dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '';
    const name = uuidv4() + ext;
    cb(null, name);
  }
});
const files = (req, file, cb) => {
  
  const allowed = [
    'text/plain',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf'
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: .txt, .png, .jpg, .jpeg, .pdf'));
  }
};

const upload = multer({
  storage,
  files,
  limits: { fileSize: 2 * 1024 * 1024 } 
});
router.use(auth);
router.get('/', async (req, res) => {
  const sorted = notes.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});
router.post('/', upload.single('attachment'), async (req, res) => {
  try {
    const { title, content } = req.body || {};
    if (!title || !content) {
      
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      return res.status(400).json({ error: 'title and content are required' });
    }

    const newNote = {
      id: uuidv4(),
      title,
      content,
      createdAt: new Date().toISOString()
    };

    if (req.file) {
     
      newNote.attachmentPath = path.relative(process.cwd(), req.file.path);
      newNote.originalFileName = req.file.originalname;
      newNote.mimetype = req.file.mimetype;
      newNote.size = req.file.size;
    }

    notes.push(newNote);

    res.status(201).json(newNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'could not create note' });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) return res.status(404).json({ error: 'note not found' });

    const [removed] = notes.splice(idx, 1);

    if (removed.attachmentPath) {
      
      const fullPath = path.resolve(process.cwd(), removed.attachmentPath);
      await fs.unlink(fullPath).catch(() => {});
    }

    res.json({ success: true, deleted: removed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'could not delete note' });
  }
});

module.exports = router;
