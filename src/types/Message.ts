export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string | null;
  text: string | null;
  image_url: string | null;
  created_at: Date | string; // ✅ Đổi từ createdAt thành created_at
}