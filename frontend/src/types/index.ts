export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface SSEEvent {
  type: 'text' | 'tool_call' | 'tool_result' | 'error' | 'done';
  payload: unknown;
}

export interface AuthStatus {
  loggedIn: boolean;
  username: string | null;
}
