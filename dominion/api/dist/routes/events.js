"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
// GET /api/events
router.get('/', async (req, res) => {
    try {
        const { agent_id } = req.query;
        let query = 'SELECT * FROM ops_agent_events';
        const params = [];
        if (agent_id) {
            params.push(agent_id);
            query += ` WHERE agent_id = $1`;
        }
        query += ' ORDER BY created_at DESC LIMIT 50';
        const result = await db_1.default.query(query, params);
        res.json(result.rows);
    }
    catch (err) {
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
        const result = await db_1.default.query(`INSERT INTO ops_agent_events (agent_id, kind, title, summary, details, tags, mission_id, step_id, related_agent_id, cost_usd)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [agent_id, kind, title, summary || null, JSON.stringify(details || {}), tags || [], mission_id || null, step_id || null, related_agent_id || null, cost_usd || 0]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error('POST /api/events error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
