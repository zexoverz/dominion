"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const event_bus_1 = __importDefault(require("../event-bus"));
const router = (0, express_1.Router)();
// GET /api/costs — summary
router.get('/', async (_req, res) => {
    try {
        const [daily, weekly, monthly] = await Promise.all([
            db_1.default.query(`SELECT COALESCE(SUM(cost_usd), 0)::float as total FROM ops_cost_tracking WHERE date = CURRENT_DATE`),
            db_1.default.query(`SELECT COALESCE(SUM(cost_usd), 0)::float as total FROM ops_cost_tracking WHERE date >= CURRENT_DATE - 7`),
            db_1.default.query(`SELECT COALESCE(SUM(cost_usd), 0)::float as total FROM ops_cost_tracking WHERE date >= CURRENT_DATE - 30`),
        ]);
        res.json({
            daily: daily.rows[0].total,
            weekly: weekly.rows[0].total,
            monthly: monthly.rows[0].total,
        });
    }
    catch (err) {
        console.error('GET /api/costs error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// GET /api/costs/daily
router.get('/daily', async (_req, res) => {
    try {
        const result = await db_1.default.query(`SELECT * FROM ops_cost_tracking WHERE date = CURRENT_DATE ORDER BY cost_usd DESC`);
        res.json(result.rows);
    }
    catch (err) {
        console.error('GET /api/costs/daily error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// POST /api/costs
router.post('/', async (req, res) => {
    try {
        const { agent_id, tokens_used, cost_usd, operation_counts } = req.body;
        if (!agent_id) {
            return res.status(400).json({ error: 'agent_id required' });
        }
        const result = await db_1.default.query(`INSERT INTO ops_cost_tracking (agent_id, tokens_used, cost_usd, operation_counts)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (agent_id, date) DO UPDATE SET
         tokens_used = ops_cost_tracking.tokens_used + EXCLUDED.tokens_used,
         cost_usd = ops_cost_tracking.cost_usd + EXCLUDED.cost_usd,
         operation_counts = ops_cost_tracking.operation_counts || EXCLUDED.operation_counts,
         updated_at = NOW()
       RETURNING *`, [agent_id, tokens_used || 0, cost_usd || 0, JSON.stringify(operation_counts || {})]);
        const row = result.rows[0];
        event_bus_1.default.emit('cost-update', row);
        res.status(201).json(row);
    }
    catch (err) {
        console.error('POST /api/costs error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
