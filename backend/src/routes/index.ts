import { Router, Request, Response } from 'express';
import { login, logout } from '../automation/partsource';
import { browser } from '../automation/browser';
import { runAgentStream } from '../ai/agent';
import type { ChatMessage } from '../types';

const router = Router();

// ── Auth ──────────────────────────────────────────────────────────────────────

router.post('/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body as { username?: string; password?: string };
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  const result = await login(username, password);
  if (!result.success) {
    return res.status(401).json({ error: result.error });
  }

  req.session.loggedIn = true;
  req.session.username = username;
  return res.json({ success: true, username });
});

router.post('/auth/logout', async (_req: Request, res: Response) => {
  await logout();
  res.json({ success: true });
});

router.get('/auth/status', (req: Request, res: Response) => {
  res.json({
    loggedIn: browser.isLoggedIn(),
    username: req.session.username ?? null,
  });
});

// ── Chat / AI agent (SSE) ─────────────────────────────────────────────────────

router.post('/chat', async (req: Request, res: Response) => {
  const { message, history = [] } = req.body as {
    message?: string;
    history?: ChatMessage[];
  };

  if (!message?.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  await runAgentStream(message, history, res);
  res.end();
});

export default router;
