const express = require('express');
const { v4: uuid } = require('uuid');
const db = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM blog_categories ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.post('/', authRequired, async (req, res) => {
  try {
    const id = uuid();
    const { name, slug } = req.body;
    await db.execute('INSERT INTO blog_categories (id, name, slug) VALUES (?, ?, ?)', [id, name, slug]);
    res.json({ id, name, slug });
  } catch (err) {
    console.error('Create category error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.put('/:id', authRequired, async (req, res) => {
  try {
    const { name, slug } = req.body;
    await db.execute('UPDATE blog_categories SET name=?, slug=? WHERE id=?', [name, slug, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.delete('/:id', authRequired, async (req, res) => {
  try {
    await db.execute('DELETE FROM blog_categories WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
