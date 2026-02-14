import { Router, Request, Response } from 'express';
import eventBus, { BusEventType } from '../event-bus';

const router = Router();

// GET /api/stream — Server-Sent Events endpoint
router.get('/', (req: Request, res: Response) => {
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
  const send = (type: string, payload: any) => {
    res.write(`data: ${JSON.stringify({ type, payload })}\n\n`);
  };

  // Event handlers
  const onNewEvent = (payload: any) => send('event', payload);
  const onMissionUpdate = (payload: any) => send('mission', payload);
  const onProposalUpdate = (payload: any) => send('proposal', payload);
  const onCostUpdate = (payload: any) => send('cost', payload);

  // Subscribe
  eventBus.on('new-event', onNewEvent);
  eventBus.on('mission-update', onMissionUpdate);
  eventBus.on('proposal-update', onProposalUpdate);
  eventBus.on('cost-update', onCostUpdate);

  // Keep-alive ping every 30 seconds
  const pingInterval = setInterval(() => {
    res.write(`: ping\n\n`);
  }, 30000);

  // Cleanup on disconnect
  req.on('close', () => {
    clearInterval(pingInterval);
    eventBus.off('new-event', onNewEvent);
    eventBus.off('mission-update', onMissionUpdate);
    eventBus.off('proposal-update', onProposalUpdate);
    eventBus.off('cost-update', onCostUpdate);
  });
});

export default router;
