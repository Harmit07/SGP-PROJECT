enum TransactionCategory { food, shopping, bills, travel, salary, other }
enum TransactionType { income, expense }

class TransactionEntity {
  final String id;
  final String title;
  final double amount;
  final DateTime date;
  final TransactionCategory category;
  final TransactionType type;

  const TransactionEntity({
    required this.id,
    required this.title,
    required this.amount,
    required this.date,
    required this.category,
    required this.type,
  });
}

