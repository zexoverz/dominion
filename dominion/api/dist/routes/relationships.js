"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
// GET /api/relationships
router.get('/', async (_req, res) => {
    try {
        const result = await db_1.default.query('SELECT * FROM ops_agent_relationships ORDER BY affinity DESC');
        res.json(result.rows);
    }
    catch (err) {
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
        const result = await db_1.default.query('SELECT * FROM ops_agent_relationships WHERE agent_a = $1 AND agent_b = $2', [a, b]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Relationship not found' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error('GET /api/relationships/:a/:b error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
