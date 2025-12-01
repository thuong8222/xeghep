// src/hooks/useNotificationsRealtime.ts
import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';


import { displayNotification } from '../utils/notificationService';
import { addNotification, removeNotification } from '../redux/slices/driverNotificationSlice';
import { useAppDispatch } from '../redux/hooks/useAppDispatch';

export const useNotificationsRealtime = (driverId?: string) => {
  const { socket, isConnected } = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket || !isConnected) {
      console.log('⚠️ Socket not ready for notifications');
      return;
    }

    console.log('📢 Setting up notification listeners for driver:', driverId);

    // ✅ Listen for new notifications
    const handleNewNotification = (data: any) => {
      console.log('📩 New notification received:', data);
      
      const { notification } = data;
      
      // Add to Redux store
      dispatch(addNotification(notification));
      
      // Show local notification
      displayNotification(
        notification.title,
        notification.content
      );
    };

    // ✅ Listen for notification removal
    const handleNotificationRemoved = (data: any) => {
      console.log('🗑️ Notification removed:', data);
      
      const { notification_id } = data;
      
      // Remove from Redux store
      dispatch(removeNotification(notification_id));
    };

    // Register listeners
    socket.on('new_notification', handleNewNotification);
    socket.on('notification_removed', handleNotificationRemoved);

    console.log('✅ Notification listeners registered');

    // Cleanup
    return () => {
      console.log('🔴 Removing notification listeners');
      socket.off('new_notification', handleNewNotification);
      socket.off('notification_removed', handleNotificationRemoved);
    };
  }, [socket, isConnected, driverId, dispatch]);
};