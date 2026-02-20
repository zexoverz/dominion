"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const event_bus_1 = __importDefault(require("../event-bus"));
const router = (0, express_1.Router)();
// GET /api/proposals
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        let query = 'SELECT * FROM ops_mission_proposals';
        const params = [];
        if (status) {
            params.push(status);
            query += ` WHERE status = $1`;
        }
        query += ' ORDER BY created_at DESC LIMIT 100';
        const result = await db_1.default.query(query, params);
        res.json(result.rows);
    }
    catch (err) {
        console.error('GET /api/proposals error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// POST /api/proposals
router.post('/', async (req, res) => {
    try {
        const { agent_id, title, description, priority, estimated_cost_usd, proposed_steps, metadata } = req.body;
        if (!agent_id || !title || !description) {
            return res.status(400).json({ error: 'agent_id, title, and description required' });
        }
        const result = await db_1.default.query(`INSERT INTO ops_mission_proposals (agent_id, title, description, priority, estimated_cost_usd, proposed_steps, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [agent_id, title, description, priority || 50, estimated_cost_usd || 0, JSON.stringify(proposed_steps || []), JSON.stringify(metadata || {})]);
        const row = result.rows[0];
        event_bus_1.default.emit('proposal-update', row);
        res.status(201).json(row);
    }
    catch (err) {
        console.error('POST /api/proposals error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// PATCH /api/proposals/:id — approve/reject
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejection_reason } = req.body;
        if (!status || !['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'status must be "approved" or "rejected"' });
        }
        const result = await db_1.default.query(`UPDATE ops_mission_proposals SET status = $1, rejection_reason = $2, reviewed_at = NOW() WHERE id = $3 RETURNING *`, [status, rejection_reason || null, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proposal not found' });
        }
        const updated = result.rows[0];
        event_bus_1.default.emit('proposal-update', updated);
        res.json(updated);
    }
    catch (err) {
        console.error('PATCH /api/proposals/:id error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// DELETE /api/proposals/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db_1.default.query('DELETE FROM ops_mission_proposals WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proposal not found' });
        }
        res.json({ deleted: true, id });
    }
    catch (err) {
        console.error('DELETE /api/proposals/:id error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
