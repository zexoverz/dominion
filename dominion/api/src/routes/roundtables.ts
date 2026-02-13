import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db';

const router = Router();

// GET /api/roundtables
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM ops_roundtable_queue ORDER BY created_at DESC LIMIT 50'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/roundtables error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/roundtables/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ops_roundtable_queue WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Roundtable not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET /api/roundtables/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/roundtables
router.post('/', async (req, res) => {
  try {
    const { format, topic, participants, max_turns, metadata } = req.body;
    if (!format || !topic || !participants?.length) {
      return res.status(400).json({ error: 'format, topic, and participants required' });
    }

    const conversationId = uuidv4();
    const result = await pool.query(
      `INSERT INTO ops_roundtable_queue (conversation_id, format, topic, participants, max_turns, metadata)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [conversationId, format, topic, participants, max_turns || 12, JSON.stringify(metadata || {})]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/roundtables error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
