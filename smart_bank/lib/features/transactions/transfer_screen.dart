import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../services/firestore_service.dart';
import '../../services/functions_service.dart';
import '../auth/auth_providers.dart';

class TransferScreen extends ConsumerStatefulWidget {
  const TransferScreen({super.key});

  @override
  ConsumerState<TransferScreen> createState() => _TransferScreenState();
}

class _TransferScreenState extends ConsumerState<TransferScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _amountCtrl = TextEditingController();
  bool _loading = false;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _amountCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);

    final me = FirebaseAuth.instance.currentUser!;
    final firestore = ref.read(firestoreServiceProvider);
    final functions = FunctionsService();

    try {
      final destQuery = await FirebaseFirestore.instance
          .collection('users')
          .where('email', isEqualTo: _emailCtrl.text.trim())
          .limit(1)
          .get();

      if (destQuery.docs.isEmpty) {
        throw Exception('Destination user not found');
      }
      final toUid = destQuery.docs.first.id;
      final amount = num.parse(_amountCtrl.text);

      if (toUid == me.uid) {
        throw Exception('Cannot transfer to yourself');
      }

      await firestore.appendTransactionForUsers(
        fromUid: me.uid,
        toUid: toUid,
        amount: amount,
      );

      // Optional: call function to send push notification.
      await functions.notifyTransfer(toUid: toUid, amount: amount);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Transfer successful')),
        );
        Navigator.of(context).pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Send Money')),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 420),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: TextFormField(
                      controller: _emailCtrl,
                      decoration: const InputDecoration(labelText: 'Recipient Email'),
                      validator: (v) => (v == null || !v.contains('@')) ? 'Enter a valid email' : null,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: TextFormField(
                      controller: _amountCtrl,
                      decoration: const InputDecoration(labelText: 'Amount'),
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      validator: (v) {
                        if (v == null || v.isEmpty) return 'Required';
                        final value = num.tryParse(v);
                        if (value == null || value <= 0) return 'Enter a positive amount';
                        return null;
                      },
                    ),
                  ),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: _loading ? null : _submit,
                      child: const Text('Send'),
                    ),
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}