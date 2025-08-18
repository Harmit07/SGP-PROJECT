import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'auth_providers.dart';
import '../notifications/fcm_manager.dart';

class AuthSideEffects extends ConsumerStatefulWidget {
  const AuthSideEffects({required this.child, super.key});

  final Widget child;

  @override
  ConsumerState<AuthSideEffects> createState() => _AuthSideEffectsState();
}

class _AuthSideEffectsState extends ConsumerState<AuthSideEffects> {
  final _fcm = FcmManager();
  ScaffoldMessengerState? _messenger;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _messenger = ScaffoldMessenger.maybeOf(context);
  }

  @override
  void initState() {
    super.initState();
    ref.listen(authStateProvider, (prev, next) async {
      final user = await next.whenData((u) => u).future;
      if (user != null) {
        await _fcm.initAndSaveToken();
      }
    });

    FirebaseMessaging.onMessage.listen((msg) {
      final notif = msg.notification;
      if (notif != null && _messenger != null) {
        _messenger!.showSnackBar(
          SnackBar(content: Text('${notif.title ?? 'Notification'}: ${notif.body ?? ''}')),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) => widget.child;
}