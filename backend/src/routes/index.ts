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

// ── Email download ────────────────────────────────────────────────────────────

router.post('/email/download', (req: Request, res: Response) => {
  const { subject, body } = req.body as { subject?: string; body?: string };
  if (!body) return res.status(400).json({ error: 'body is required' });

  const safeSubject = (subject ?? 'Backorder Alert').replace(/[^a-zA-Z0-9 _-]/g, '').trim();
  const filename = `${safeSubject.replace(/\s+/g, '_')}.eml`;

  const emlContent = [
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Subject: ${subject ?? 'Backorder Alert'}`,
    ``,
    body,
  ].join('\r\n');

  res.setHeader('Content-Type', 'message/rfc822');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(emlContent);
});

export default router;
