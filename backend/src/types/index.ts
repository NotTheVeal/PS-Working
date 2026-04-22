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

export interface VendorAlternative {
  vendor: string;
  vendorLogo: string;
  partNumber: string;
  description: string;
  manufacturer: string;
  price: string;
  availability: string;
  inStock: boolean;
  url: string;
  imageUrl?: string;
}

export interface BackorderAlert {
  part: Part;
  riskScore: number;
  riskReason: string;
  isBackordered: boolean;
  alternatives: VendorAlternative[];
}

export interface EmailDraft {
  to: string;
  subject: string;
  body: string;
  backordered: Part[];
  alternatives: VendorAlternative[];
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
