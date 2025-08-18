import '../entities/transaction.dart';

abstract class TransactionRepository {
  Future<List<TransactionEntity>> listTransactions(String userId);
  Future<void> addTransaction(String userId, TransactionEntity transaction);
  Future<void> updateTransaction(String userId, TransactionEntity transaction);
  Future<void> deleteTransaction(String userId, String transactionId);
}

