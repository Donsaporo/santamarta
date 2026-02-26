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

const imageExtensions = /jpeg|jpg|png|gif|webp|svg/;
const videoExtensions = /mp4|webm|ogg|mov|avi|mkv/;
const videoMimeTypes = /video\/(mp4|webm|ogg|quicktime|x-msvideo|x-matroska)/;

const imageUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = imageExtensions.test(path.extname(file.originalname).toLowerCase());
    const mime = imageExtensions.test(file.mimetype.split('/')[1]);
    if (ext || mime) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imagenes'));
    }
  },
});

const videoUpload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = videoExtensions.test(path.extname(file.originalname).toLowerCase().replace('.', ''));
    const mime = videoMimeTypes.test(file.mimetype);
    if (ext || mime) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten videos (mp4, webm, ogg, mov)'));
    }
  },
});

router.post('/', authRequired, (req, res) => {
  imageUpload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer upload error:', err);
      return res.status(500).json({ error: err.message || 'Error al subir imagen' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibio imagen' });
    }
    const url = `/api/uploads/${req.file.filename}`;
    res.json({ url });
  });
});

router.post('/video', authRequired, (req, res) => {
  videoUpload.single('video')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'El video excede el limite de 200MB' });
      }
      console.error('Video upload error:', err);
      return res.status(500).json({ error: err.message || 'Error al subir video' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibio video' });
    }
    const url = `/api/uploads/${req.file.filename}`;
    res.json({ url, type: 'video' });
  });
});

module.exports = router;
