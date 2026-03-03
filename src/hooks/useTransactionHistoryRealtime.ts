import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/data/store';
import { displayNotification } from '../utils/notificationService';
import { addTransaction } from '../redux/slices/pointSlice';

export const useTransactionHistoryRealtime = (userId?: string) => {
  const { socket, isConnected } = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    console.log('🔥 Transaction Hook Render - userId:', userId);
  }, [userId]);

  useEffect(() => {
    if (!socket || !isConnected || !userId) {
      console.log('⚠️ Transaction history realtime not ready:', {
        socket: !!socket,
        isConnected,
        userId,
      });
      return;
    }
    const handleTransactionUpdate = async (data: any) => {
      const { transaction } = data.transaction;
      if (transaction) {
        dispatch(addTransaction(transaction));
        try {
          const isReceive = transaction.type === 'buy_points';
          await displayNotification(
            `Giao dịch ${isReceive ? 'mua' : 'bán'}`,
            `Bạn ${isReceive ? 'nhận' : 'chuyển'} ${transaction.change} điểm`,
          );
        } catch (error) {
          console.error('❌ Error showing notification:', error);
        }
      }
    };
    socket.on('transaction_updated', handleTransactionUpdate);
    return () => {
      socket.off('transaction_updated', handleTransactionUpdate);
    };
  }, [socket, isConnected, userId, dispatch]);
};
