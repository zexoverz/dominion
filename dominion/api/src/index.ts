import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import generalsRouter from './routes/generals';
import missionsRouter from './routes/missions';
import proposalsRouter from './routes/proposals';
import roundtablesRouter from './routes/roundtables';
import costsRouter from './routes/costs';
import eventsRouter from './routes/events';
import relationshipsRouter from './routes/relationships';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'dominion-api', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/generals', generalsRouter);
app.use('/api/missions', missionsRouter);
app.use('/api/proposals', proposalsRouter);
app.use('/api/roundtables', roundtablesRouter);
app.use('/api/costs', costsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/relationships', relationshipsRouter);

app.listen(PORT, () => {
  console.log(`Dominion API running on port ${PORT}`);
});

export default app;
