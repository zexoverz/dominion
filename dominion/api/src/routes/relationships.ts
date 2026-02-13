import { Router } from 'express';
import pool from '../db';

const router = Router();

// GET /api/relationships
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM ops_agent_relationships ORDER BY affinity DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/relationships error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/relationships/:agentA/:agentB
router.get('/:agentA/:agentB', async (req, res) => {
  try {
    const { agentA, agentB } = req.params;
    // Ensure consistent ordering (agent_a < agent_b constraint)
    const [a, b] = [agentA, agentB].sort();

    const result = await pool.query(
      'SELECT * FROM ops_agent_relationships WHERE agent_a = $1 AND agent_b = $2',
      [a, b]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Relationship not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET /api/relationships/:a/:b error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
