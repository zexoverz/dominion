"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
// GET /api/roundtables
router.get('/', async (_req, res) => {
    try {
        const result = await db_1.default.query('SELECT * FROM ops_roundtable_queue ORDER BY created_at DESC LIMIT 50');
        res.json(result.rows);
    }
    catch (err) {
        console.error('GET /api/roundtables error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// GET /api/roundtables/:id
router.get('/:id', async (req, res) => {
    try {
        const result = await db_1.default.query('SELECT * FROM ops_roundtable_queue WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Roundtable not found' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
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
        const conversationId = (0, uuid_1.v4)();
        const result = await db_1.default.query(`INSERT INTO ops_roundtable_queue (conversation_id, format, topic, participants, max_turns, metadata)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [conversationId, format, topic, participants, max_turns || 12, JSON.stringify(metadata || {})]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error('POST /api/roundtables error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
