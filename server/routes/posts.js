const express = require('express');
const { v4: uuid } = require('uuid');
const db = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { status, slug, category_id, exclude, limit } = req.query;
    let query = `
      SELECT p.*, c.id as cat_id, c.name as cat_name, c.slug as cat_slug, c.created_at as cat_created_at
      FROM blog_posts p
      LEFT JOIN blog_categories c ON p.category_id = c.id
    `;
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push('p.status = ?');
      params.push(status);
    }

    if (slug) {
      conditions.push('p.slug = ?');
      params.push(slug);
    }

    if (category_id) {
      conditions.push('p.category_id = ?');
      params.push(category_id);
    }

    if (exclude) {
      conditions.push('p.id != ?');
      params.push(exclude);
    }

    if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY p.created_at DESC';

    if (limit) {
      query += ` LIMIT ${parseInt(limit, 10)}`;
    }

    const [rows] = await db.execute(query, params);

    const posts = rows.map(row => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      excerpt: row.excerpt,
      featured_image: row.featured_image,
      video_url: row.video_url,
      category_id: row.category_id,
      author_id: row.author_id,
      status: row.status,
      published_at: row.published_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: row.cat_id ? {
        id: row.cat_id,
        name: row.cat_name,
        slug: row.cat_slug,
        created_at: row.cat_created_at,
      } : null,
    }));

    res.json(posts);
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT p.*, c.id as cat_id, c.name as cat_name, c.slug as cat_slug, c.created_at as cat_created_at
       FROM blog_posts p
       LEFT JOIN blog_categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    const row = rows[0];
    res.json({
      ...row,
      category: row.cat_id ? {
        id: row.cat_id,
        name: row.cat_name,
        slug: row.cat_slug,
        created_at: row.cat_created_at,
      } : null,
    });
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.post('/', authRequired, async (req, res) => {
  try {
    const id = uuid();
    const { title, slug, content, excerpt, featured_image, video_url, category_id, status, published_at } = req.body;

    await db.execute(
      `INSERT INTO blog_posts (id, title, slug, content, excerpt, featured_image, video_url, category_id, author_id, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, slug, content || '', excerpt || '', featured_image || '', video_url || '', category_id || null, req.user.id, status || 'draft', published_at || null]
    );

    res.json({ id });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.put('/:id', authRequired, async (req, res) => {
  try {
    const { title, slug, content, excerpt, featured_image, video_url, category_id, status, published_at } = req.body;

    await db.execute(
      `UPDATE blog_posts SET title=?, slug=?, content=?, excerpt=?, featured_image=?, video_url=?, category_id=?, status=?, published_at=?, updated_at=NOW()
       WHERE id=?`,
      [title, slug, content || '', excerpt || '', featured_image || '', video_url || '', category_id || null, status || 'draft', published_at || null, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Update post error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.delete('/:id', authRequired, async (req, res) => {
  try {
    await db.execute('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
