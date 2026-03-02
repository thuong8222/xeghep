// src/hooks/useNotificationsRealtime.ts
import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

import { displayNotification } from '../utils/notificationService';
import {
  addNotification,
  removeNotification,
} from '../redux/slices/driverNotificationSlice';
import { useAppDispatch } from '../redux/hooks/useAppDispatch';

export const useNotificationsRealtime = (driverId?: string) => {
  const { socket, isConnected } = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket || !isConnected) {
      return;
    }

    // ✅ Listen for new notifications
    const handleNewNotification = (data: any) => {
      const { notification } = data;

      // Add to Redux store
      dispatch(addNotification(notification));

      // Show local notification
      displayNotification(notification.title, notification.content);
    };

    // ✅ Listen for notification removal
    const handleNotificationRemoved = (data: any) => {
      const { notification_id } = data;

      // Remove from Redux store
      dispatch(removeNotification(notification_id));
    };

    // Register listeners
    socket.on('new_notification', handleNewNotification);
    socket.on('notification_removed', handleNotificationRemoved);

    // Cleanup
    return () => {
      socket.off('new_notification', handleNewNotification);
      socket.off('notification_removed', handleNotificationRemoved);
    };
  }, [socket, isConnected, driverId, dispatch]);
};
