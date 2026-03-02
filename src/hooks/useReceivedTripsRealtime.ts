import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/data/store';
import { addReceivedTrip } from '../redux/slices/tripsSlice';

export const useReceivedTripsRealtime = (userId?: string) => {
  const { socket, isConnected } = useSocket();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!socket || !isConnected || !userId) {
      return;
    }

    const handleReceivedTripsUpdate = (data: any) => {
      /*
      DATA STRUCTURE:
      {
        trip: { id_trip: "...", ... }
      }
      */

      const { trip } = data;

      if (trip) {
        // Thêm chuyến vào danh sách "Chuyến đã nhận"
        dispatch(addReceivedTrip(trip));
      }
    };

    socket.on('received_trips_updated', handleReceivedTripsUpdate);

    return () => {
      socket.off('received_trips_updated', handleReceivedTripsUpdate);
    };
  }, [socket, isConnected, userId, dispatch]);
};
