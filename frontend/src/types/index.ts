export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface SSEEvent {
  type: 'text' | 'tool_call' | 'tool_result' | 'backorder_alert' | 'email_draft' | 'error' | 'done';
  payload: unknown;
}

export interface AuthStatus {
  loggedIn: boolean;
  username: string | null;
}

export interface BackorderAlertData {
  partNumber: string;
  description: string;
  manufacturer: string;
  availability: string;
  isBackordered: boolean;
  riskScore: number;
  riskReason: string;
  riskEmoji: string;
  url: string;
}

export interface EmailDraftData {
  subject: string;
  body: string;
  to: string;
}
