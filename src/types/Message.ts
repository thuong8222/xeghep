export interface Message {
  id?: string;
  sender_id: number;
  receiver_id: number;
  text?: string;
  image_url?: string; // ⭐ Đổi từ image thành image_url
  type?: 'text' | 'image';
  user?: string;
  created_at?: string;
}