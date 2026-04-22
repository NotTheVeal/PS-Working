export interface Part {
  id: string;
  partNumber: string;
  description: string;
  manufacturer: string;
  price: string;
  availability: string;
  url: string;
  imageUrl?: string;
  leadTime?: string;
}

export interface CartItem {
  part: Part;
  quantity: number;
  lineTotal: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: string;
  itemCount: number;
}

export interface Order {
  orderNumber: string;
  date: string;
  status: string;
  total: string;
  items: Array<{ description: string; quantity: number; price: string }>;
}

export interface AutomationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface SessionData {
  loggedIn?: boolean;
  username?: string;
  chatHistory?: ChatMessage[];
}

declare module 'express-session' {
  interface SessionData {
    loggedIn?: boolean;
    username?: string;
    chatHistory?: ChatMessage[];
  }
}
