import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/data/store";
import { displayNotification } from "../utils/notificationService";
import { addTransaction } from "../redux/slices/pointSlice";

export const useTransactionHistoryRealtime = (userId?: string) => {
  const { socket, isConnected } = useSocket();
  const dispatch = useDispatch<AppDispatch>();

  console.log("🔍 Transaction hook - userId:", userId);
  console.log("🔍 Transaction hook - socket:", !!socket);
  console.log("🔍 Transaction hook - isConnected:", isConnected);
  useEffect(() => {
    if (!socket || !isConnected || !userId) {
  ;
      console.log("⚠️ Transaction history realtime not ready:", {
        socket: !!socket,
        isConnected,
        userId
      });
      return;
    }

    console.log("🔔 Setting up transaction history listener for:", userId);
    console.log("📡 Socket ID:", socket.id);

    const handleTransactionUpdate = async (data: any) => {
      console.log("📜 New transaction:", data);

      const { transaction } = data;

      if (transaction) {
        console.log("➕ Adding transaction:", transaction.id);
        // ✅ Thêm giao dịch mới vào state.history
        dispatch(addTransaction(transaction));
        console.log("✅ Added new transaction to history");

        // Hiển thị notification
        try {
          const isReceive = transaction.type === 'buy_points';
          await displayNotification(
            'Giao dịch mới',
            `Bạn ${isReceive ? 'nhận' : 'chuyển'} ${Math.abs(transaction.amount)} điểm`
          );
        } catch (error) {
          console.error("❌ Error showing notification:", error);
        }
      }
    };

    socket.on("transaction_updated", handleTransactionUpdate);
    console.log("✅ Registered 'transaction_updated' listener");
    return () => {
      console.log("🔕 Removing transaction history listener");
      socket.off("transaction_updated", handleTransactionUpdate);
    };
  }, [socket, isConnected, userId, dispatch]);
};
