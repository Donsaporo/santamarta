const express = require('express');
const multer = require('multer');
const path = require('path');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype.split('/')[1]);
    if (ext || mime) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imagenes'));
    }
  },
});

router.post('/', authRequired, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibio imagen' });
  }
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

module.exports = router;
