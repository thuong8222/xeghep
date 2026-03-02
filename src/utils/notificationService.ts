// notificationService.ts
import messaging, {
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { navigate, navigationRef } from '../navigation/navigationRef';
import { CommonActions } from '@react-navigation/native';

/**
 * Yêu cầu quyền notification từ user
 */
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
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
  try {
    const token = await messaging().getToken();
    // console.log('✅ FCM Token:', token);
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
  messaging().onMessage(async remoteMessage => {
    console.log('📩 Foreground message received:', remoteMessage);
    await displayNotification(
      remoteMessage?.notification?.title || remoteMessage?.data?.title,
      remoteMessage.notification?.body || remoteMessage.data?.body,
      remoteMessage.data?.navData
        ? JSON.parse(remoteMessage.data.navData)
        : undefined,
    );
  });
}

/**
 * Lắng nghe notification khi app ở background hoặc bị tắt
 * Gọi ở index.js / index.ts (ngoài React component)
 */
export function registerBackgroundHandler() {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    await displayNotification(
      remoteMessage.notification?.title || remoteMessage.data?.title,
      remoteMessage.notification?.body || remoteMessage.data?.body,
      remoteMessage.data?.navData
        ? JSON.parse(remoteMessage.data.navData)
        : undefined,
    );
  });
}

// /**
//  * ⭐ Setup listener để bắt sự kiện khi user click vào notification
//  * Gọi hàm này trong App.tsx hoặc index.js
//  */
// export function setupNotificationListeners(navigation: any) {
//   // 1️⃣ Xử lý khi app đang chạy (foreground) và user click notification
//   notifee.onForegroundEvent(({ type, detail }) => {
//     if (type === EventType.PRESS) {
//       console.log('🔔 Notification pressed (foreground):', detail.notification);
//       handleNotificationNavigation(detail.notification?.data, navigation);
//     }
//   });

//   // 2️⃣ Xử lý khi app bị kill hoặc background và user click notification
//   notifee.onBackgroundEvent(async ({ type, detail }) => {
//     if (type === EventType.PRESS) {
//       console.log('🔔 Notification pressed (background):', detail.notification);
//       // Navigation sẽ được handle khi app mở lại
//     }
//   });

//   // 3️⃣ Kiểm tra xem app có được mở từ notification không (khi app bị kill)
//   notifee.getInitialNotification().then(initialNotification => {
//     if (initialNotification) {
//       console.log('🔔 App opened from notification:', initialNotification.notification);
//       handleNotificationNavigation(initialNotification.notification?.data, navigation);
//     }
//   });

//   // 4️⃣ Xử lý khi click notification từ FCM (khi app background/killed)
//   messaging().onNotificationOpenedApp(remoteMessage => {
//     console.log('🔔 Notification caused app to open from background:', remoteMessage);
//     if (remoteMessage.data?.navData) {
//       const navData = JSON.parse(remoteMessage.data.navData);
//       handleNotificationNavigation({ navData: remoteMessage.data.navData }, navigation);
//     }
//   });

//   // 5️⃣ Kiểm tra xem app có được mở từ notification FCM không (khi app bị kill)
//   messaging()
//     .getInitialNotification()
//     .then(remoteMessage => {
//       if (remoteMessage) {
//         console.log('🔔 App opened from killed state by notification:', remoteMessage);
//         if (remoteMessage.data?.navData) {
//           const navData = JSON.parse(remoteMessage.data.navData);
//           handleNotificationNavigation({ navData: remoteMessage.data.navData }, navigation);
//         }
//       }
//     });
// }

// /**
//  * ⭐ Hàm xử lý điều hướng dựa trên data từ notification
//  */
// function handleNotificationNavigation(data: any, navigation: any) {
//   if (!data?.navData) {
//     console.log('⚠️ No navigation data in notification');
//     return;
//   }

//   try {
//     const navData = typeof data.navData === 'string'
//       ? JSON.parse(data.navData)
//       : data.navData;

//     const { screen, params } = navData;

//     if (screen && navigation) {
//       console.log(`🧭 Navigating to: ${screen}`, params);
//       navigation.navigate(screen, params);
//     }
//   } catch (error) {
//     console.error('❌ Error parsing navigation data:', error);
//   }
// }

// Xử lý điều hướng từ notification
export function handleNotificationNavigation(data: any) {
  if (!data?.navData) return;

  try {
    const navData =
      typeof data.navData === 'string'
        ? JSON.parse(data.navData)
        : data.navData;

    if (!navData.screen) return;

    console.log('🧭 Navigating via nested params:', navData);

    // Dùng navigationRef để navigate qua nested navigator
    navigationRef.dispatch(
      CommonActions.navigate({
        name: navData.screen, // RootNavigator
        params: navData.params, // params: { screen: 'BottomTabs', params: { ... } }
      }),
    );
  } catch (error) {
    console.error('❌ Error parsing navigation data:', error);
  }
}

// Setup listener notification
export function setupNotificationListeners() {
  // Foreground
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      handleNotificationNavigation(detail.notification?.data);
    }
  });

  // Background
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
      handleNotificationNavigation(detail.notification?.data);
    }
  });

  // App killed state
  notifee.getInitialNotification().then(initialNotification => {
    if (initialNotification) {
      handleNotificationNavigation(initialNotification.notification?.data);
    }
  });

  // FCM background click
  messaging().onNotificationOpenedApp(remoteMessage => {
    if (remoteMessage.data?.navData) {
      handleNotificationNavigation({ navData: remoteMessage.data.navData });
    }
  });

  // FCM killed app
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage?.data?.navData) {
        handleNotificationNavigation({ navData: remoteMessage.data.navData });
      }
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
export async function displayNotification(
  title?: string,
  body?: string,
  navData?: { screen: string; params?: any },
) {
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
    data: navData ? { navData: JSON.stringify(navData) } : {}, // ⭐ Gửi dữ liệu điều hướng
    android: {
      channelId: 'default',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      pressAction: { id: 'default' }, // ⭐ quan trọng để bắt được event
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
