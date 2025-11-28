import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";

interface TripTransaction {
  id: number;
  trip_id: number;
  driver_sell_id: number;
  driver_buy_id: number;
  points: number;
  price: number;
  payment: number;
  created_at: string;
}

interface TripTransactionUpdateData {
  transaction: TripTransaction;
}

interface UseTripTransactionUpdatesProps {
  userId?: string;
  onTransactionUpdate?: (transaction: TripTransaction) => void;
}

export const useTripTransactionUpdates = ({
  userId,
  onTransactionUpdate,
}: UseTripTransactionUpdatesProps = {}) => {
  const { socket, isConnected } = useSocket();

  console.log('useTripTransactionUpdates:', userId);

  useEffect(() => {
    if (!socket || !isConnected || !userId) {
      console.log("⚠️ Trip transaction updates hook not ready:", { 
        socket: !!socket, 
        isConnected, 
        userId 
      });
      return;
    }

    console.log("📜 Setting up trip transaction updates listener for user:", userId);

    const handleTransactionUpdate = (data: TripTransactionUpdateData) => {
      console.log("📩 TRIP TRANSACTION UPDATED:", data);
      
      const { transaction } = data;

      // Gọi callback nếu có
      if (onTransactionUpdate) {
        onTransactionUpdate(transaction);
      }

      // TODO: Có thể cập nhật state quản lý danh sách giao dịch
      // Ví dụ: thêm transaction mới vào đầu danh sách
      console.log("💰 New trip transaction:", {
        id: transaction.id,
        trip_id: transaction.trip_id,
        points: transaction.points,
        price: transaction.price,
      });
    };

    // ✅ Listen event "trip_transaction_updated" từ server
    socket.on("trip_transaction_updated", handleTransactionUpdate);

    return () => {
      console.log("🔕 Removing trip transaction updates listener");
      socket.off("trip_transaction_updated", handleTransactionUpdate);
    };
  }, [socket, isConnected, userId, onTransactionUpdate]);
};