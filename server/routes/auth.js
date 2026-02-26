const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const db = require('../db');
const { authRequired, signToken } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contrasena requeridos' });
    }

    const [rows] = await db.execute('SELECT * FROM admin_users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.get('/me', authRequired, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, email, created_at FROM admin_users WHERE id = ?', [req.user.id]);
    const user = rows[0];
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ user });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.post('/create-admin', async (req, res) => {
  try {
    const { email, password, setup_key } = req.body;

    if (setup_key !== process.env.SETUP_KEY) {
      return res.status(403).json({ error: 'Clave de setup invalida' });
    }

    if (!email || !password || password.length < 6) {
      return res.status(400).json({ error: 'Email y contrasena (min 6 chars) requeridos' });
    }

    const [existing] = await db.execute('SELECT id FROM admin_users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'El email ya esta registrado' });
    }

    const id = uuid();
    const hash = await bcrypt.hash(password, 12);
    await db.execute('INSERT INTO admin_users (id, email, password_hash) VALUES (?, ?, ?)', [id, email, hash]);

    res.json({ message: 'Admin creado exitosamente' });
  } catch (err) {
    console.error('Create admin error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
