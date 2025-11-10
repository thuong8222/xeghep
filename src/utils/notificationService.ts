// notificationService.ts
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';
/**
 * Yêu cầu quyền notification từ user
 */
export async function requestUserPermission() {
  console.log('requestUserPermission')
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    await getFcmToken();
  } else {
    Alert.alert('Permission denied for notifications');
  }
}

/**
 * Lấy FCM token và log ra console
 * Có thể gửi lên server nếu cần
 */
export async function getFcmToken() {
  console.log('durring getFcmToken')
  try {
    const token = await messaging().getToken();
    console.log('✅ FCM Token:', token);
    return token;
  } catch (error) {
    console.log('❌ Error getting FCM token:', error);
  }
}

/**
 * Lắng nghe notification khi app đang foreground
 */
export function listenForForegroundMessages() {
  messaging().onMessage(async remoteMessage => {
    console.log('📩 Foreground message received:', remoteMessage);
  
    await displayNotification(
      remoteMessage.notification?.title,
      remoteMessage.notification?.body
    );
  });
  
}

/**
 * Lắng nghe notification khi app ở background hoặc killed
 * Thêm ở index.js / index.ts để đảm bảo chạy khi app chưa mở
 */
export function registerBackgroundHandler() {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('📩 Background message received:', remoteMessage);
    // Xử lý message khi app background / killed
  });
}

/**
 * Subscribe / unsubscribe topic nếu cần
 */
export async function subscribeToTopic(topic: string) {
  try {
    await messaging().subscribeToTopic(topic);
    console.log(`✅ Subscribed to topic: ${topic}`);
  } catch (error) {
    console.log('❌ Subscribe topic error:', error);
  }
}

export async function unsubscribeFromTopic(topic: string) {
  try {
    await messaging().unsubscribeFromTopic(topic);
    console.log(`✅ Unsubscribed from topic: ${topic}`);
  } catch (error) {
    console.log('❌ Unsubscribe topic error:', error);
  }
}
/**
 * Hiển thị notification bằng Notifee
 */
export async function displayNotification(title?: string, body?: string) {
  await notifee.displayNotification({
    title: title || 'Notification',
    body: body || '',
    android: {
      channelId: 'default',
      importance: AndroidImportance.HIGH,
    },
  });
}

/**
 * Lắng nghe foreground notification
 */
export async function createAndroidChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
}