import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/data/store';
import { addPoint, updatePoint, removePoint } from '../redux/slices/pointSlice'; // ✅ Import từ pointSlice

export const usePointsListRealtime = () => {
  const { socket, isConnected } = useSocket();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!socket || !isConnected) {
      return;
    }

    const handlePointsUpdate = (data: any) => {
      const { action, point } = data;

      switch (action) {
        case 'created':
          // Thêm điểm mới vào danh sách
          dispatch(addPoint(point));

          break;

        case 'bought':
          // Cập nhật status thành 'pending_payment'

          dispatch(updatePoint(point));

          break;

        case 'confirmed':
          // Xóa khỏi danh sách (vì đã completed)
          dispatch(removePoint(point.id));

          break;

        default:
          console.log('⚠️ Unknown action:', action);
      }
    };

    socket.on('points_list_updated', handlePointsUpdate);

    return () => {
      socket.off('points_list_updated', handlePointsUpdate);
    };
  }, [socket, isConnected, dispatch]);
};
