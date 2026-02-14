import { Router } from 'express';
import pool from '../db';
import eventBus from '../event-bus';

const router = Router();

// GET /api/events
router.get('/', async (req, res) => {
  try {
    const { agent_id } = req.query;
    let query = 'SELECT * FROM ops_agent_events';
    const params: any[] = [];

    if (agent_id) {
      params.push(agent_id);
      query += ` WHERE agent_id = $1`;
    }
    query += ' ORDER BY created_at DESC LIMIT 50';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/events error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/events
router.post('/', async (req, res) => {
  try {
    const { agent_id, kind, title, summary, details, tags, mission_id, step_id, related_agent_id, cost_usd } = req.body;
    if (!agent_id || !kind || !title) {
      return res.status(400).json({ error: 'agent_id, kind, and title required' });
    }

    const result = await pool.query(
      `INSERT INTO ops_agent_events (agent_id, kind, title, summary, details, tags, mission_id, step_id, related_agent_id, cost_usd)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [agent_id, kind, title, summary || null, JSON.stringify(details || {}), tags || [], mission_id || null, step_id || null, related_agent_id || null, cost_usd || 0]
    );
    const row = result.rows[0];
    eventBus.emit('new-event', row);
    res.status(201).json(row);
  } catch (err) {
    console.error('POST /api/events error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
