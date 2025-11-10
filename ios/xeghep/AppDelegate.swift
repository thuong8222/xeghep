import UIKit
import React
import Firebase
import UserNotifications

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Firebase
    FirebaseApp.configure()

    // Notification
    #4  0x0000000104bdaf88 in AppDelegate.application(_:didFinishLaunchingWithOptions:) at /Users/bzotech/chat-app-xeghep/xeghep/ios/xeghep/AppDelegate.swift:24
    UNUserNotificationCenter.current().delegate = self
    application.registerForRemoteNotifications()
    Messaging.messaging().delegate = self

    // React Native
    guard let jsBundleLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index") else {
        fatalError("❌ Could not find JS bundle URL")
    }
    let rootView = RCTRootView(bundleURL: jsBundleLocation, moduleName: "xeghep", initialProperties: nil)

    let rootViewController = UIViewController()
    rootViewController.view = rootView

    self.window = UIWindow(frame: UIScreen.main.bounds)
    self.window?.rootViewController = rootViewController
    self.window?.makeKeyAndVisible()

    return true
  }

  func application(_ application: UIApplication,
                   didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    Messaging.messaging().apnsToken = deviceToken
  }
}

extension AppDelegate: UNUserNotificationCenterDelegate, MessagingDelegate {
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              willPresent notification: UNNotification,
                              withCompletionHandler completionHandler:
                              @escaping (UNNotificationPresentationOptions) -> Void) {
    completionHandler([.banner, .sound, .badge])
  }

  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              didReceive response: UNNotificationResponse,
                              withCompletionHandler completionHandler: @escaping () -> Void) {
    completionHandler()
  }

  func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
    print("✅ FCM Token: \(fcmToken ?? "")")
  }
}
