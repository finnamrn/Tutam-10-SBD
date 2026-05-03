const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM todos ORDER BY created_at DESC'
    );
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({ success: false, error: 'ID must be a number' });
    }

    const result = await pool.query(
      'SELECT * FROM todos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Title is required and cannot be empty',
      });
    }

    if (title.trim().length > 255) {
      return res.status(400).json({
        success: false,
        error: 'Title cannot exceed 255 characters',
      });
    }

    const result = await pool.query(
      'INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *',
      [title.trim(), description ? description.trim() : null]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    if (isNaN(Number(id))) {
      return res.status(400).json({ success: false, error: 'ID must be a number' });
    }

    const existing = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }

    const current = existing.rows[0];
    const updatedTitle = title !== undefined ? title.trim() : current.title;
    const updatedDescription = description !== undefined ? description : current.description;
    const updatedCompleted = completed !== undefined ? completed : current.completed;

    if (updatedTitle === '') {
      return res.status(400).json({ success: false, error: 'Title cannot be empty' });
    }

    const result = await pool.query(
      `UPDATE todos
       SET title = $1, description = $2, completed = $3
       WHERE id = $4
       RETURNING *`,
      [updatedTitle, updatedDescription, updatedCompleted, id]
    );

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({ success: false, error: 'ID must be a number' });
    }

    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
