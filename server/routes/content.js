const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT `key`, value, section, label, field_type FROM site_content ORDER BY section');
    res.json(rows);
  } catch (err) {
    console.error('Get content error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.put('/:key', authRequired, async (req, res) => {
  try {
    const { value } = req.body;
    await db.execute('UPDATE site_content SET value = ?, updated_at = NOW() WHERE `key` = ?', [value, req.params.key]);
    res.json({ success: true });
  } catch (err) {
    console.error('Update content error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
