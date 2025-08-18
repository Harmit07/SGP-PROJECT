import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../transactions/presentation/screens/home_shell.dart';

final authStateProvider = StateProvider<bool>((ref) => true); // mocked signed-in by default

class AuthGate extends ConsumerWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isSignedIn = ref.watch(authStateProvider);
    if (isSignedIn) {
      return const HomeShell();
    }
    return const _SignInScreen();
  }
}

class _SignInScreen extends ConsumerWidget {
  const _SignInScreen();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              Text(
                'SmartPocket Pro',
                style: Theme.of(context).textTheme.headlineMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                'Personal finance manager and smart banking assistant',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const Spacer(),
              ElevatedButton.icon(
                onPressed: () => ref.read(authStateProvider.notifier).state = true,
                icon: const Icon(Icons.email_outlined),
                label: const Text('Continue with Email'),
              ),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                onPressed: () => ref.read(authStateProvider.notifier).state = true,
                icon: const Icon(Icons.g_mobiledata_rounded),
                label: const Text('Continue with Google'),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}

