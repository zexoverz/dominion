"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const generals_1 = __importDefault(require("./routes/generals"));
const missions_1 = __importDefault(require("./routes/missions"));
const proposals_1 = __importDefault(require("./routes/proposals"));
const roundtables_1 = __importDefault(require("./routes/roundtables"));
const costs_1 = __importDefault(require("./routes/costs"));
const events_1 = __importDefault(require("./routes/events"));
const relationships_1 = __importDefault(require("./routes/relationships"));
const stream_1 = __importDefault(require("./routes/stream"));
const reports_1 = __importDefault(require("./routes/reports"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '3001', 10);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check
app.get('/', (_req, res) => {
    res.json({ status: 'ok', service: 'dominion-api', timestamp: new Date().toISOString() });
});
// Routes
app.use('/api/generals', generals_1.default);
app.use('/api/missions', missions_1.default);
app.use('/api/proposals', proposals_1.default);
app.use('/api/roundtables', roundtables_1.default);
app.use('/api/costs', costs_1.default);
app.use('/api/events', events_1.default);
app.use('/api/relationships', relationships_1.default);
app.use('/api/stream', stream_1.default);
app.use('/api/reports', reports_1.default);
app.listen(PORT, () => {
    console.log(`Dominion API running on port ${PORT}`);
});
exports.default = app;
