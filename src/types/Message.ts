export interface Message {
    user: string;
    text: string;
    createdAt?: string;
    to?: string; // người nhận cụ thể (nếu có)
  }