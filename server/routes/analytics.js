const express = require('express');
const { v4: uuid } = require('uuid');
const db = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const id = uuid();
    const { page_path, page_title, referrer, user_agent, device_type, browser, os, country, city, session_id } = req.body;

    await db.execute(
      `INSERT INTO page_views (id, page_path, page_title, referrer, user_agent, device_type, browser, os, country, city, session_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, page_path || '/', page_title || '', referrer || '', user_agent || '', device_type || 'desktop', browser || '', os || '', country || '', city || '', session_id || '']
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Track page view error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.get('/', authRequired, async (req, res) => {
  try {
    const { since } = req.query;
    let query = 'SELECT * FROM page_views';
    const params = [];

    if (since) {
      query += ' WHERE created_at >= ?';
      params.push(since);
    }

    query += ' ORDER BY created_at ASC';

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Get analytics error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
