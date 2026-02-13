"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const generals_config_1 = require("../generals-config");
const router = (0, express_1.Router)();
// GET /api/generals — list all generals
router.get('/', (_req, res) => {
    res.json(generals_config_1.GENERALS);
});
// GET /api/generals/:id — single general + DB stats
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const general = generals_config_1.GENERALS_MAP[id.toUpperCase()];
        if (!general) {
            return res.status(404).json({ error: 'General not found' });
        }
        const [missions, events, costs] = await Promise.all([
            db_1.default.query(`SELECT status, COUNT(*)::int as count FROM ops_missions WHERE agent_id = $1 GROUP BY status`, [general.id]),
            db_1.default.query(`SELECT COUNT(*)::int as count FROM ops_agent_events WHERE agent_id = $1 AND created_at > NOW() - INTERVAL '7 days'`, [general.id]),
            db_1.default.query(`SELECT COALESCE(SUM(cost_usd), 0)::float as total_cost FROM ops_cost_tracking WHERE agent_id = $1 AND date >= CURRENT_DATE - 30`, [general.id]),
        ]);
        res.json({
            ...general,
            stats: {
                missions: Object.fromEntries(missions.rows.map(r => [r.status, r.count])),
                events_last_7d: events.rows[0]?.count ?? 0,
                cost_last_30d: costs.rows[0]?.total_cost ?? 0,
            },
        });
    }
    catch (err) {
        console.error('GET /api/generals/:id error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
