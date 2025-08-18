## Smart Bank (Flutter + Firebase + AI)

Features:
- Email/Password Authentication
- Secure Firestore storage (profile, balance, transactions)
- Money Transfers
- Transaction History
- AI Financial Assistant (Cloud Functions + OpenAI)
- Push Notifications (FCM)

### Requirements
- Flutter 3+
- Firebase project
- Node.js 18+ for Cloud Functions

### Setup
1) Install dependencies:
```bash
cd smart_bank
flutter pub get
```
2) Firebase configuration:
- Run `flutterfire configure` to generate `lib/firebase_options.dart` with real values (replace the stub).
- Android: add `google-services.json` and apply Gradle plugins.
- iOS: add `GoogleService-Info.plist` and run `pod install`.
- Web: ensure `firebase_options.dart` contains web section and `index.html` uses the generated config if needed.

3) Enable Firebase products: Auth (email/password), Firestore, Cloud Functions, Cloud Messaging.

4) Cloud Functions:
```bash
cd functions
npm i
# Set OpenAI key
firebase functions:config:set openai.key="YOUR_OPENAI_KEY"
# Or set env var OPENAI_API_KEY in your hosting env
npm run build
firebase deploy --only functions
```

5) Run app:
```bash
cd ..
flutter run
```

### Notes
- Initial demo balance for new users is set to 1000.
- The function `notifyTransfer` expects user documents to store `fcmToken`.