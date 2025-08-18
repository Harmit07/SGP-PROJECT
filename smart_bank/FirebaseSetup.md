### Firebase Setup Guide

1) Create a Firebase project at `https://console.firebase.google.com`.
2) Enable products:
   - Authentication: Email/Password
   - Cloud Firestore (Start in production or test – set rules as needed)
   - Cloud Messaging
   - Cloud Functions
3) Add apps (Android/iOS/Web) and download platform config files.
4) FlutterFire:
   - Install: `dart pub global activate flutterfire_cli`
   - Run: `flutterfire configure` inside `smart_bank` folder. This generates `lib/firebase_options.dart` (replace the stub).
5) Android:
   - Place `google-services.json` under `android/app/`.
   - In `android/build.gradle` add classpath for `com.google.gms:google-services` if needed.
   - In `android/app/build.gradle` apply plugin: `com.google.gms.google-services`.
6) iOS:
   - Add `GoogleService-Info.plist` to `ios/Runner`.
   - Add `Firebase/Core` pods via `pod install` after `cd ios`.
7) Web:
   - Ensure `firebase_options.dart` contains `DefaultFirebaseOptions.web` values from FlutterFire.
8) Cloud Functions:
   - `cd functions && npm i`
   - Set OpenAI key: `firebase functions:config:set openai.key="YOUR_OPENAI_KEY"`
   - `npm run build`
   - `firebase deploy --only functions`
9) Firestore security rules (basic):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, update: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
    match /users/{userId}/transactions/{txId} {
      allow read, create: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```