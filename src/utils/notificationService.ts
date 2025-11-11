// notificationService.ts
import messaging, {
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

/**
 * Yêu cầu quyền notification từ user
 */
export async function requestUserPermission() {
  console.log('requestUserPermission');
  const authStatus = await messaging().requestPermission();
  console.log('authStatus: ', authStatus);

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    await getFcmToken();

    // 2️⃣ Xin quyền local notification (cho Notifee)
    const notifeeSettings = await notifee.requestPermission({
      sound: true,
      alert: true,
      badge: true,
      announcement: true,
    });

    if (notifeeSettings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      console.log('✅ Notifee permission granted.');
    } else {
      console.log('🚫 Notifee permission denied.');
    }
  } else {
    Alert.alert('Permission denied for notifications');
  }
}

/**
 * Lấy FCM token và log ra console
 */
export async function getFcmToken() {
  console.log('durring getFcmToken');
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
 * messaging().onMessage
 */
export function listenForForegroundMessages() {
  console.log('notification khi app đang foreground');
  messaging().onMessage(async remoteMessage => {
    console.log('📩 Foreground message received:', remoteMessage);
    await displayNotification(
      remoteMessage?.notification?.title || remoteMessage?.data?.title,
      remoteMessage.notification?.body || remoteMessage.data?.body,
    );
  });
}

/**
 * Lắng nghe notification khi app ở background hoặc bị tắt
 * Gọi ở index.js / index.ts (ngoài React component)
 */
export function registerBackgroundHandler() {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('📩 Background message received:', remoteMessage);
    await displayNotification(
      remoteMessage.notification?.title || remoteMessage.data?.title,
      remoteMessage.notification?.body || remoteMessage.data?.body,
    );
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
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  }

  await notifee.displayNotification({
    title: title || 'Notification',
    body: body || '',
    android: {
      channelId: 'default',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      pressAction: { id: 'default' },
      smallIcon: 'ic_launcher',
    },
    ios: {
      sound: 'default',
      foregroundPresentationOptions: {
        alert: true,
        sound: true,
        badge: true,
      },
    },
  });
}

/**
 * Tạo Android channel (nếu cần riêng)
 */
export async function createAndroidChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
}
