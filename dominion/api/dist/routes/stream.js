"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_bus_1 = __importDefault(require("../event-bus"));
const router = (0, express_1.Router)();
// GET /api/stream — Server-Sent Events endpoint
router.get('/', (req, res) => {
    // SSE headers
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // disable nginx buffering
    });
    // Send initial connection event
    res.write(`data: ${JSON.stringify({ type: 'connected', payload: { timestamp: new Date().toISOString() } })}\n\n`);
    // Helper to send SSE data
    const send = (type, payload) => {
        res.write(`data: ${JSON.stringify({ type, payload })}\n\n`);
    };
    // Event handlers
    const onNewEvent = (payload) => send('event', payload);
    const onMissionUpdate = (payload) => send('mission', payload);
    const onProposalUpdate = (payload) => send('proposal', payload);
    const onCostUpdate = (payload) => send('cost', payload);
    // Subscribe
    event_bus_1.default.on('new-event', onNewEvent);
    event_bus_1.default.on('mission-update', onMissionUpdate);
    event_bus_1.default.on('proposal-update', onProposalUpdate);
    event_bus_1.default.on('cost-update', onCostUpdate);
    // Keep-alive ping every 30 seconds
    const pingInterval = setInterval(() => {
        res.write(`: ping\n\n`);
    }, 30000);
    // Cleanup on disconnect
    req.on('close', () => {
        clearInterval(pingInterval);
        event_bus_1.default.off('new-event', onNewEvent);
        event_bus_1.default.off('mission-update', onMissionUpdate);
        event_bus_1.default.off('proposal-update', onProposalUpdate);
        event_bus_1.default.off('cost-update', onCostUpdate);
    });
});
exports.default = router;
