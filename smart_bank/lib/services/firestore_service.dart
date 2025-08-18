import 'package:cloud_firestore/cloud_firestore.dart';

import '../models/transaction_model.dart';
import '../models/user_profile.dart';

class FirestoreService {
  FirestoreService({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  final FirebaseFirestore _firestore;

  CollectionReference<Map<String, dynamic>> get usersCol =>
      _firestore.collection('users');

  CollectionReference<Map<String, dynamic>> txCol(String uid) =>
      usersCol.doc(uid).collection('transactions');

  Future<UserProfile?> getUser(String uid) async {
    final snap = await usersCol.doc(uid).get();
    if (!snap.exists) return null;
    return UserProfile.fromMap(snap.data()!, snap.id);
  }

  Future<void> updateUser(String uid, Map<String, dynamic> data) async {
    await usersCol.doc(uid).update(data);
  }

  Future<void> appendTransactionForUsers({
    required String fromUid,
    required String toUid,
    required num amount,
  }) async {
    await _firestore.runTransaction((txn) async {
      final fromRef = usersCol.doc(fromUid);
      final toRef = usersCol.doc(toUid);

      final fromSnap = await txn.get(fromRef);
      final toSnap = await txn.get(toRef);

      if (!fromSnap.exists || !toSnap.exists) {
        throw Exception('User not found');
      }

      final fromBal = (fromSnap.data()!['balance'] as num? ?? 0);
      final toBal = (toSnap.data()!['balance'] as num? ?? 0);
      if (fromBal < amount) {
        throw Exception('Insufficient balance');
      }

      txn.update(fromRef, {'balance': fromBal - amount});
      txn.update(toRef, {'balance': toBal + amount});

      final now = DateTime.now().millisecondsSinceEpoch;
      final fromTx = BankTransaction(
        id: '',
        fromUid: fromUid,
        toUid: toUid,
        amount: amount,
        createdAt: DateTime.fromMillisecondsSinceEpoch(now),
        type: TransactionType.send,
      );
      final toTx = BankTransaction(
        id: '',
        fromUid: fromUid,
        toUid: toUid,
        amount: amount,
        createdAt: DateTime.fromMillisecondsSinceEpoch(now),
        type: TransactionType.receive,
      );

      txn.set(txCol(fromUid).doc(), fromTx.toMap());
      txn.set(txCol(toUid).doc(), toTx.toMap());
    });
  }

  Stream<List<BankTransaction>> watchTransactions(String uid) {
    return txCol(uid)
        .orderBy('createdAt', descending: true)
        .limit(50)
        .snapshots()
        .map((snap) => snap.docs
            .map((d) => BankTransaction.fromMap(d.data(), d.id))
            .toList());
  }
}