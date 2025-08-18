enum TransactionType { send, receive }

class BankTransaction {
  final String id;
  final String fromUid;
  final String toUid;
  final num amount;
  final DateTime createdAt;
  final TransactionType type;

  const BankTransaction({
    required this.id,
    required this.fromUid,
    required this.toUid,
    required this.amount,
    required this.createdAt,
    required this.type,
  });

  factory BankTransaction.fromMap(Map<String, dynamic> map, String id) {
    return BankTransaction(
      id: id,
      fromUid: map['fromUid'] as String? ?? '',
      toUid: map['toUid'] as String? ?? '',
      amount: map['amount'] as num? ?? 0,
      createdAt: DateTime.fromMillisecondsSinceEpoch(
          (map['createdAt'] as int?) ?? DateTime.now().millisecondsSinceEpoch),
      type: (map['type'] as String) == 'send'
          ? TransactionType.send
          : TransactionType.receive,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'fromUid': fromUid,
      'toUid': toUid,
      'amount': amount,
      'createdAt': createdAt.millisecondsSinceEpoch,
      'type': type.name,
    };
  }
}