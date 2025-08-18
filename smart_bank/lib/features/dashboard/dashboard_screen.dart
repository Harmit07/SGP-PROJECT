import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../models/user_profile.dart';
import '../../services/firestore_service.dart';
import '../auth/auth_providers.dart';
import '../transactions/transfer_screen.dart';
import '../transactions/transactions_screen.dart';
import '../assistant/assistant_screen.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = FirebaseAuth.instance.currentUser!;
    final profileFuture = ref.watch(_profileFutureProvider(user.uid));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Smart Bank'),
        actions: [
          IconButton(
            onPressed: () => ref.read(authServiceProvider).signOut(),
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
          )
        ],
      ),
      body: profileFuture.when(
        data: (profile) => _DashboardBody(profile: profile),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
      ),
    );
  }
}

final _profileFutureProvider = FutureProvider.family<UserProfile, String>((ref, uid) async {
  final svc = ref.read(firestoreServiceProvider);
  final profile = await svc.getUser(uid);
  return profile!;
});

class _DashboardBody extends StatelessWidget {
  const _DashboardBody({required this.profile});

  final UserProfile profile;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Welcome, ${profile.displayName}', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 8),
          Card(
            child: ListTile(
              title: const Text('Current Balance'),
              subtitle: Text('${profile.email}'),
              trailing: Text('\$${profile.balance.toStringAsFixed(2)}',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold)),
            ),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _ActionButton(
                icon: Icons.send,
                label: 'Transfer',
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const TransferScreen()),
                ),
              ),
              _ActionButton(
                icon: Icons.receipt_long,
                label: 'Transactions',
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const TransactionsScreen()),
                ),
              ),
              _ActionButton(
                icon: Icons.smart_toy,
                label: 'AI Assistant',
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const AssistantScreen()),
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  const _ActionButton({required this.icon, required this.label, required this.onTap});
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Ink(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 28),
            const SizedBox(height: 6),
            Text(label),
          ],
        ),
      ),
    );
  }
}