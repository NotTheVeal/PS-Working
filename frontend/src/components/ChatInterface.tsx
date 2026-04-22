import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api/client';
import type { ChatMessage, SSEEvent } from '../types';

interface AssistantBubble {
  role: 'assistant';
  content: string;
  toolCalls: Array<{ name: string; input?: unknown; output?: string }>;
  timestamp: number;
}
type DisplayMessage = ChatMessage | AssistantBubble;

const SUGGESTIONS = [
  'Search for SKF 6205 deep groove ball bearing',
  'Find 1/2" NPT stainless steel ball valve',
  'Show my current cart',
  'View my recent orders',
  'Add 10 units of the first search result to cart',
];

interface Props {
  username: string;
}

export default function ChatInterface({ username }: Props) {
  const [messages, setMessages] = useState<DisplayMessage[]>([
    {
      role: 'assistant',
      content: `Welcome back, **${username}**! I'm your PartsSource AI assistant.\n\nI can help you:\n- 🔍 Search for industrial parts by name, description, or part number\n- 🛒 Add parts to your cart and manage quantities\n- 📦 Place and track orders\n\nWhat parts are you looking for today?`,
      toolCalls: [],
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getHistory = (): ChatMessage[] =>
    messages
      .filter((m): m is ChatMessage => m.role === 'user' || (m.role === 'assistant' && !('toolCalls' in m && (m as AssistantBubble).toolCalls.length > 0)))
      .map((m) => ({ role: m.role, content: m.content, timestamp: m.timestamp }));

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return;

    const userMsg: ChatMessage = { role: 'user', content: text.trim(), timestamp: Date.now() };
    const assistantBubble: AssistantBubble = {
      role: 'assistant',
      content: '',
      toolCalls: [],
      timestamp: Date.now() + 1,
    };

    setMessages((prev) => [...prev, userMsg, assistantBubble]);
    setInput('');
    setStreaming(true);

    const history = getHistory();

    try {
      await api.chatStream(text.trim(), history, (event: SSEEvent) => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1] as AssistantBubble;

          if (event.type === 'text') {
            last.content += event.payload as string;
          } else if (event.type === 'tool_call') {
            const tc = event.payload as { name: string; input: unknown };
            last.toolCalls = [...last.toolCalls, { name: tc.name, input: tc.input }];
          } else if (event.type === 'tool_result') {
            const tr = event.payload as { name: string; output: string };
            const idx = [...last.toolCalls].reverse().findIndex((t) => t.name === tr.name);
            if (idx !== -1) {
              const realIdx = last.toolCalls.length - 1 - idx;
              last.toolCalls = last.toolCalls.map((t, i) =>
                i === realIdx ? { ...t, output: tr.output } : t,
              );
            }
          }

          return updated;
        });
      });
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1] as AssistantBubble;
        last.content = `Error: ${err instanceof Error ? err.message : String(err)}`;
        return updated;
      });
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {streaming && (
          <div style={styles.typingIndicator}>
            <span style={styles.dot} />
            <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
            <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div style={styles.suggestions}>
          {SUGGESTIONS.map((s) => (
            <button key={s} style={styles.suggestionBtn} onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div style={styles.inputRow}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search parts, manage cart, track orders… (Enter to send)"
          disabled={streaming}
          rows={1}
          style={styles.textarea}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={streaming || !input.trim()}
          style={styles.sendBtn}
          aria-label="Send"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: DisplayMessage }) {
  const isUser = msg.role === 'user';
  const bubble = msg as AssistantBubble;
  const toolCalls = !isUser ? (bubble.toolCalls ?? []) : [];

  return (
    <div style={{ ...styles.bubble, ...(isUser ? styles.bubbleUser : styles.bubbleAI) }}>
      {!isUser && (
        <div style={styles.aiLabel}>
          <span style={styles.aiIcon}>⚙️</span> PartsSource AI
        </div>
      )}

      {toolCalls.map((tc, i) => (
        <div key={i} style={styles.toolCard}>
          <div style={styles.toolHeader}>
            <span style={styles.toolIcon}>🔧</span>
            <code style={styles.toolName}>{tc.name}</code>
          </div>
          {tc.output && (
            <div style={styles.toolOutput}>{tc.output}</div>
          )}
        </div>
      ))}

      {msg.content && (
        <div
          style={isUser ? styles.userText : styles.aiText}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
        />
      )}
    </div>
  );
}

function renderMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:rgba(255,255,255,0.08);padding:1px 5px;border-radius:4px;font-family:monospace">$1</code>')
    .replace(/^#{1,3} (.+)$/gm, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '• $1')
    .replace(/\n/g, '<br/>');
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  bubble: {
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: 12,
    lineHeight: 1.6,
    fontSize: 14,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    background: 'var(--accent)',
    color: '#fff',
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    alignSelf: 'flex-start',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderBottomLeftRadius: 4,
    maxWidth: '90%',
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  aiIcon: { fontSize: 12 },
  aiText: { color: 'var(--text)' },
  userText: { color: '#fff' },
  toolCard: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    padding: '8px 10px',
    marginBottom: 8,
    fontSize: 12,
  },
  toolHeader: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 },
  toolIcon: { fontSize: 11 },
  toolName: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: 'var(--accent)',
    background: 'transparent',
  },
  toolOutput: {
    color: 'var(--text-muted)',
    fontSize: 12,
    whiteSpace: 'pre-wrap',
    maxHeight: 200,
    overflowY: 'auto',
    marginTop: 4,
  },
  typingIndicator: {
    display: 'flex',
    alignSelf: 'flex-start',
    gap: 4,
    padding: '12px 16px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    borderBottomLeftRadius: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--text-muted)',
    animation: 'pulse 1.2s ease-in-out infinite',
  },
  suggestions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    padding: '0 16px 12px',
  },
  suggestionBtn: {
    padding: '6px 12px',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    color: 'var(--text-muted)',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  inputRow: {
    display: 'flex',
    gap: 8,
    padding: '12px 16px',
    borderTop: '1px solid var(--border)',
    background: 'var(--surface)',
  },
  textarea: {
    flex: 1,
    padding: '10px 14px',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    resize: 'none',
    outline: 'none',
    lineHeight: 1.5,
    maxHeight: 120,
    overflowY: 'auto',
  },
  sendBtn: {
    width: 42,
    height: 42,
    background: 'var(--accent)',
    color: '#fff',
    borderRadius: 'var(--radius)',
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    alignSelf: 'flex-end',
    transition: 'background 0.15s',
  },
};
