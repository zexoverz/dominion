import { Router } from 'express';
import pool from '../db';
import { GENERALS, GENERALS_MAP } from '../generals-config';

const router = Router();

// GET /api/generals — list all generals
router.get('/', (_req, res) => {
  res.json(GENERALS);
});

// GET /api/generals/:id — single general + DB stats
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const general = GENERALS_MAP[id.toUpperCase()];
    if (!general) {
      return res.status(404).json({ error: 'General not found' });
    }

    const [missions, events, costs] = await Promise.all([
      pool.query(
        `SELECT status, COUNT(*)::int as count FROM ops_missions WHERE agent_id = $1 GROUP BY status`,
        [general.id]
      ),
      pool.query(
        `SELECT COUNT(*)::int as count FROM ops_agent_events WHERE agent_id = $1 AND created_at > NOW() - INTERVAL '7 days'`,
        [general.id]
      ),
      pool.query(
        `SELECT COALESCE(SUM(cost_usd), 0)::float as total_cost FROM ops_cost_tracking WHERE agent_id = $1 AND date >= CURRENT_DATE - 30`,
        [general.id]
      ),
    ]);

    res.json({
      ...general,
      stats: {
        missions: Object.fromEntries(missions.rows.map(r => [r.status, r.count])),
        events_last_7d: events.rows[0]?.count ?? 0,
        cost_last_30d: costs.rows[0]?.total_cost ?? 0,
      },
    });
  } catch (err) {
    console.error('GET /api/generals/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
