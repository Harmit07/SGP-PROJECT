// Placeholder for future Firestore implementation
// In production, implement CRUD using cloud_firestore and map to/from domain entities.

import '../domain/repositories/transaction_repository.dart';
import '../domain/entities/transaction.dart';

class FirestoreTransactionRepository implements TransactionRepository {
  @override
  Future<List<TransactionEntity>> listTransactions(String userId) async {
    // TODO: implement using Firebase Firestore
    return const [];
  }

  @override
  Future<void> addTransaction(String userId, TransactionEntity transaction) async {}

  @override
  Future<void> updateTransaction(String userId, TransactionEntity transaction) async {}

  @override
  Future<void> deleteTransaction(String userId, String transactionId) async {}
}

