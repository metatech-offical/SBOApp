import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import FirebaseAuth
import FirebaseMessaging
import AVFoundation
@main
class AppDelegate: RCTAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil
  ) -> Bool {
    self.moduleName = "Sbo"
    self.dependencyProvider = RCTAppDependencyProvider()
    FirebaseApp.configure()
    FirebaseConfiguration.shared.setLoggerLevel(.debug)
    // Register for remote notifications (APNs)
    UNUserNotificationCenter.current().delegate = self
    application.registerForRemoteNotifications()
    // Optional: Audio session (for apps using call/audio features)
    let session = AVAudioSession.sharedInstance()
    do {
      if #available(iOS 10.0, *) {
        try session.setCategory(.playAndRecord, mode: .voiceChat, options: [.defaultToSpeaker, .allowBluetooth])
      } else {
        try session.setCategory(.playAndRecord, options: [.defaultToSpeaker, .allowBluetooth])
        try session.setMode(.voiceChat)
      }
      try session.setActive(true)
    } catch {
      print("Failed to configure audio session: \(error)")
    }
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
  // Handle incoming deep links (used for verification URLs)
  override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
  ) -> Bool {
    if Auth.auth().canHandle(url) {
      return true
    }
    return super.application(app, open: url, options: options)
  }
  // Pass the APNs token to Firebase Auth
  override func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    Auth.auth().setAPNSToken(deviceToken, type: .unknown) // .sandbox for dev, .prod for release, or .unknown for auto
    Messaging.messaging().apnsToken = deviceToken
    print(":white_tick: APNs token registered and passed to Firebase")
  }
  override func application(
    _ application: UIApplication,
    didFailToRegisterForRemoteNotificationsWithError error: Error
  ) {
    print(":x: Failed to register for remote notifications: \(error)")
  }
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    return self.bundleURL()
  }
  override func bundleURL() -> URL? {
    #if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}
// Required to handle notifications when app is in foreground
extension AppDelegate: UNUserNotificationCenterDelegate {
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    completionHandler([.sound, .badge, .banner])
  }
}