class TxValidators {
  static String? email(String? v) {
    if (v == null || !v.contains('@')) return 'Enter a valid email';
    return null;
  }

  static String? amount(String? v) {
    if (v == null || v.isEmpty) return 'Required';
    final value = num.tryParse(v);
    if (value == null || value <= 0) return 'Enter a positive amount';
    return null;
  }
}