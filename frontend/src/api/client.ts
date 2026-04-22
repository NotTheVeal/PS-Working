import type { ChatMessage, SSEEvent } from '../types';

const BASE = '/api';

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...init,
  });
  const json = await res.json();
  if (!res.ok) throw new Error((json as { error?: string }).error ?? `HTTP ${res.status}`);
  return json as T;
}

export const api = {
  login: (username: string, password: string) =>
    fetchJSON<{ success: boolean; username: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  logout: () =>
    fetchJSON<{ success: boolean }>('/auth/logout', { method: 'POST' }),

  authStatus: () =>
    fetchJSON<{ loggedIn: boolean; username: string | null }>('/auth/status'),

  chatStream: (
    message: string,
    history: ChatMessage[],
    onEvent: (e: SSEEvent) => void,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      fetch(`${BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message, history }),
      }).then((res) => {
        if (!res.ok || !res.body) {
          reject(new Error(`HTTP ${res.status}`));
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        const pump = (): Promise<void> =>
          reader.read().then(({ done, value }) => {
            if (done) { resolve(); return; }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n\n');
            buffer = lines.pop() ?? '';
            for (const chunk of lines) {
              const line = chunk.replace(/^data: /, '').trim();
              if (!line) continue;
              try { onEvent(JSON.parse(line) as SSEEvent); } catch { /* skip */ }
            }
            return pump();
          });

        pump().catch(reject);
      }).catch(reject);
    });
  },
};
