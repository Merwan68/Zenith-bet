import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory Sandbox Data Store
const auditLogs = [
  { id: 'LOG-1', action: 'System Boot & Provider Adapters Initialized', user: 'Kernel', timestamp: new Date().toISOString() },
  { id: 'LOG-2', action: 'Sportradar Sandbox Feed Connected (Latency: 14ms)', user: 'SportsWorker', timestamp: new Date().toISOString() },
  { id: 'LOG-3', action: 'Telebirr Sandbox IPN Webhook Registered', user: 'PaymentWorker', timestamp: new Date().toISOString() },
];

// --- REST API Endpoints ---

// 1. Health & Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    environment: isProd ? 'production' : 'development-sandbox',
    version: '1.0.0-zenith',
    serverTime: new Date().toISOString(),
    providers: {
      sportradar: 'connected-sandbox',
      betradar: 'connected-sandbox',
      spribe: 'adapter-ready',
      pragmatic: 'awaiting-agreement',
      telebirr: 'sandbox-active',
    },
  });
});

// 2. Telebirr Sandbox Initiate API
app.post('/api/v1/telebirr/initiate', (req: Request, res: Response) => {
  const { phoneNumber, amount } = req.body;
  if (!phoneNumber || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid phoneNumber and positive amount are required.' });
  }

  const transactionRef = `TB-ETB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    action: `Telebirr Deposit Initiated: ${amount} ETB to ${phoneNumber}`,
    user: 'TelebirrGateway',
    timestamp: new Date().toISOString(),
  });

  return res.json({
    success: true,
    transactionRef,
    orderId: `ORD-${Date.now()}`,
    ussdPromptSent: true,
    message: `Sandbox USSD push prompt dispatched to ${phoneNumber}.`,
  });
});

// 3. Telebirr Sandbox Confirm Webhook / IPN Simulation
app.post('/api/v1/telebirr/confirm', (req: Request, res: Response) => {
  const { transactionRef, amount, phoneNumber } = req.body;
  if (!transactionRef) {
    return res.status(400).json({ error: 'transactionRef is required.' });
  }

  auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    action: `Telebirr Sandbox Payment Verified: Ref ${transactionRef}`,
    user: 'IPN-Webhook',
    timestamp: new Date().toISOString(),
  });

  return res.json({
    success: true,
    status: 'completed',
    transactionRef,
    creditedAmount: amount,
    currency: 'ETB',
    verifiedSignature: 'SHA256withRSA-OK',
  });
});

// 4. Admin Audit Logs
app.get('/api/admin/audit-logs', (req: Request, res: Response) => {
  res.json({ logs: auditLogs });
});

// 5. Server-Sent Events (SSE) for Real-Time Odds & Multipliers Stream
app.get('/api/stream/odds', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const interval = setInterval(() => {
    const payload = {
      event: 'odds_tick',
      eventId: 'fb-live-1',
      market: '1X2',
      odds: Number((1.55 + Math.random() * 0.2).toFixed(2)),
      timestamp: Date.now(),
    };
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  }, 4000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// --- Vite Dev Server Middleware or Static Production Serving ---
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Zenith Gaming Server running on port ${PORT} [${isProd ? 'PROD' : 'DEV'}]`);
  });
}

startServer();
