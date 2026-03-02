import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

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

  useEffect(() => {
    if (!socket || !isConnected || !userId) {
      return;
    }

    const handleTransactionUpdate = (data: TripTransactionUpdateData) => {
      const { transaction } = data;

      // Gọi callback nếu có
      if (onTransactionUpdate) {
        onTransactionUpdate(transaction);
      }

      // TODO: Có thể cập nhật state quản lý danh sách giao dịch
      // Ví dụ: thêm transaction mới vào đầu danh sách
    };

    // ✅ Listen event "trip_transaction_updated" từ server
    socket.on('trip_transaction_updated', handleTransactionUpdate);

    return () => {
      socket.off('trip_transaction_updated', handleTransactionUpdate);
    };
  }, [socket, isConnected, userId, onTransactionUpdate]);
};
