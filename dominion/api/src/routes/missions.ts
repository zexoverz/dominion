import { Router } from 'express';
import pool from '../db';
import eventBus from '../event-bus';

const router = Router();

// GET /api/missions
router.get('/', async (req, res) => {
  try {
    const { status, agent_id } = req.query;
    let query = 'SELECT * FROM ops_missions WHERE 1=1';
    const params: any[] = [];

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    if (agent_id) {
      params.push(agent_id);
      query += ` AND agent_id = $${params.length}`;
    }
    query += ' ORDER BY created_at DESC LIMIT 100';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/missions error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/missions/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mission = await pool.query('SELECT * FROM ops_missions WHERE id = $1', [id]);
    if (mission.rows.length === 0) {
      return res.status(404).json({ error: 'Mission not found' });
    }
    const steps = await pool.query(
      'SELECT * FROM ops_mission_steps WHERE mission_id = $1 ORDER BY step_order',
      [id]
    );
    res.json({ ...mission.rows[0], steps: steps.rows });
  } catch (err) {
    console.error('GET /api/missions/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/missions — create from proposal
router.post('/', async (req, res) => {
  try {
    const { proposal_id } = req.body;
    if (!proposal_id) {
      return res.status(400).json({ error: 'proposal_id required' });
    }

    const proposal = await pool.query('SELECT * FROM ops_mission_proposals WHERE id = $1', [proposal_id]);
    if (proposal.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    const p = proposal.rows[0];

    const result = await pool.query(
      `INSERT INTO ops_missions (proposal_id, agent_id, title, description, priority, estimated_cost_usd)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [p.id, p.agent_id, p.title, p.description, p.priority, p.estimated_cost_usd]
    );

    // Create steps from proposal
    let steps = p.proposed_steps || [];
    if (typeof steps === 'string') {
      try { steps = JSON.parse(steps); } catch { steps = []; }
    }
    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      await pool.query(
        `INSERT INTO ops_mission_steps (mission_id, agent_id, step_order, kind, title, description, input_data)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [result.rows[0].id, p.agent_id, i + 1, s.kind || 'execute_command', s.title || `Step ${i + 1}`, s.description || '', JSON.stringify(s.input_data || {})]
      );
    }

    const mission = result.rows[0];
    eventBus.emit('mission-update', mission);
    res.status(201).json(mission);
  } catch (err) {
    console.error('POST /api/missions error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/missions/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progress_pct, actual_cost_usd } = req.body;
    const sets: string[] = [];
    const params: any[] = [];

    if (status) {
      params.push(status);
      sets.push(`status = $${params.length}`);
      if (status === 'completed') sets.push('completed_at = NOW()');
      if (status === 'active') sets.push('started_at = COALESCE(started_at, NOW())');
    }
    if (progress_pct !== undefined) {
      params.push(progress_pct);
      sets.push(`progress_pct = $${params.length}`);
    }
    if (actual_cost_usd !== undefined) {
      params.push(actual_cost_usd);
      sets.push(`actual_cost_usd = $${params.length}`);
    }
    sets.push('last_activity_at = NOW()');

    if (sets.length <= 1) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);
    const result = await pool.query(
      `UPDATE ops_missions SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mission not found' });
    }
    const updated = result.rows[0];
    eventBus.emit('mission-update', updated);
    res.json(updated);
  } catch (err) {
    console.error('PATCH /api/missions/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/missions/:id/steps — add steps to a mission
router.post('/:id/steps', async (req, res) => {
  try {
    const { id } = req.params;
    const { steps } = req.body;
    if (!steps || !Array.isArray(steps)) {
      return res.status(400).json({ error: 'steps array required' });
    }

    const mission = await pool.query('SELECT * FROM ops_missions WHERE id = $1', [id]);
    if (mission.rows.length === 0) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    // Get current max step_order
    const maxOrder = await pool.query(
      'SELECT COALESCE(MAX(step_order), 0) as max_order FROM ops_mission_steps WHERE mission_id = $1',
      [id]
    );
    let order = maxOrder.rows[0].max_order;

    const created = [];
    for (const s of steps) {
      order++;
      const result = await pool.query(
        `INSERT INTO ops_mission_steps (mission_id, agent_id, step_order, kind, title, description, input_data)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [id, mission.rows[0].agent_id, order, s.kind || 'action', s.title, s.description || '', JSON.stringify(s.input_data || {})]
      );
      created.push(result.rows[0]);
    }

    res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/missions/:id/steps error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/missions/:mid/steps/:sid — update step status
router.patch('/:mid/steps/:sid', async (req, res) => {
  try {
    const { mid, sid } = req.params;
    const { status, output_data } = req.body;
    const sets: string[] = [];
    const params: any[] = [];

    if (status) {
      params.push(status);
      sets.push(`status = $${params.length}`);
      if (status === 'completed') sets.push('completed_at = NOW()');
      if (status === 'running') sets.push('started_at = COALESCE(started_at, NOW())');
    }
    if (output_data !== undefined) {
      params.push(JSON.stringify(output_data));
      sets.push(`output_data = $${params.length}`);
    }

    if (sets.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(sid);
    params.push(mid);
    const result = await pool.query(
      `UPDATE ops_mission_steps SET ${sets.join(', ')} WHERE id = $${params.length - 1} AND mission_id = $${params.length} RETURNING *`,
      params
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Step not found' });
    }

    // Update mission last_activity_at
    await pool.query('UPDATE ops_missions SET last_activity_at = NOW() WHERE id = $1', [mid]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PATCH step error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
