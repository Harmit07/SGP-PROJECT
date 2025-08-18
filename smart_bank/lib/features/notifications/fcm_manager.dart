import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

class FcmManager {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;

  Future<void> initAndSaveToken() async {
    await _requestPermission();

    final token = await _messaging.getToken();
    final user = FirebaseAuth.instance.currentUser;
    if (token != null && user != null) {
      await FirebaseFirestore.instance
          .collection('users')
          .doc(user.uid)
          .update({'fcmToken': token});
    }

    FirebaseMessaging.instance.onTokenRefresh.listen((newToken) async {
      final u = FirebaseAuth.instance.currentUser;
      if (u != null) {
        await FirebaseFirestore.instance
            .collection('users')
            .doc(u.uid)
            .update({'fcmToken': newToken});
      }
    });
  }

  Future<void> _requestPermission() async {
    await _messaging.requestPermission(
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    );
  }
}