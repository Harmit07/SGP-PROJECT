import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../models/transaction_model.dart';
import '../../services/firestore_service.dart';
import '../auth/auth_providers.dart';

class TransactionsScreen extends ConsumerWidget {
  const TransactionsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final me = FirebaseAuth.instance.currentUser!;
    final stream = ref.read(firestoreServiceProvider).watchTransactions(me.uid);
    final dateFmt = DateFormat.yMMMd().add_jm();

    return Scaffold(
      appBar: AppBar(title: const Text('Transactions')),
      body: StreamBuilder<List<BankTransaction>>(
        stream: stream,
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator());
          }
          final txs = snapshot.data!;
          if (txs.isEmpty) {
            return const Center(child: Text('No transactions yet'));
          }
          return ListView.separated(
            itemCount: txs.length,
            separatorBuilder: (_, __) => const Divider(height: 1),
            itemBuilder: (context, i) {
              final tx = txs[i];
              final isSend = tx.type == TransactionType.send;
              return ListTile(
                leading: CircleAvatar(
                  backgroundColor: isSend
                      ? Theme.of(context).colorScheme.errorContainer
                      : Theme.of(context).colorScheme.tertiaryContainer,
                  child: Icon(isSend ? Icons.north_east : Icons.south_west),
                ),
                title: Text(isSend ? 'Sent to ${tx.toUid}' : 'Received from ${tx.fromUid}'),
                subtitle: Text(dateFmt.format(tx.createdAt)),
                trailing: Text(
                  (isSend ? '-' : '+') + '\$${tx.amount.toStringAsFixed(2)}',
                  style: TextStyle(
                    color: isSend ? Colors.red : Colors.green,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}