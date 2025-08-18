# SmartPocket Pro

Personal finance manager and smart banking assistant built with Flutter, Riverpod, and Firebase.

## Quick start

1. Ensure Flutter SDK is installed.
2. From project root:
   - `flutter pub get`
   - `flutter run`

The app boots with mock data so you can explore the dashboard, analysis charts, budgeting, and CRUD on transactions.

## Firebase setup

Configure later to enable auth, Firestore persistence and FCM notifications.

1. Create a project in the Firebase Console.
2. Add Android and iOS apps.
   - Android package name: `com.example.smartpocket_pro` (change as needed in `android/app/build.gradle.kts`).
   - iOS bundle id: `com.example.smartpocketPro` (change as needed in Xcode `Runner`).
3. Download config files:
   - Place `google-services.json` in `android/app/`.
   - Place `GoogleService-Info.plist` in `ios/Runner/`.
4. Add FlutterFire packages (already in `pubspec.yaml`). Initialize in `main.dart` later by adding:
   ```dart
   import 'package:firebase_core/firebase_core.dart';
   void main() async {
     WidgetsFlutterBinding.ensureInitialized();
     await Firebase.initializeApp();
     runApp(const ProviderScope(child: SmartPocketApp()));
   }
   ```
5. Android: Google services plugin is already applied in `android/app/build.gradle.kts`. Build will auto-detect configs.
6. iOS: Add the `GoogleService-Info.plist` to Runner target and run `pod install` in `ios`.

## Architecture

Clean architecture with feature-driven folders and Riverpod for state.

```
lib/
  core/
    app.dart
    theme/
  features/
    auth/
      presentation/
    transactions/
      data/
      domain/
        entities/
        repositories/
      presentation/
        screens/
  main.dart
```

## Notes

- Dark/Light theme toggle persists via secure storage.
- Replace mock auth and transactions with Firebase implementations in `data/`.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

### Linux desktop prerequisites

To run on Linux desktop locally, install build tools:

```
sudo apt-get update && sudo apt-get install -y ninja-build cmake libgtk-3-dev clang
```