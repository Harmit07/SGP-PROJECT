class UserProfile {
  final String uid;
  final String email;
  final String displayName;
  final String fcmToken;
  final num balance;

  const UserProfile({
    required this.uid,
    required this.email,
    required this.displayName,
    required this.fcmToken,
    required this.balance,
  });

  UserProfile copyWith({
    String? displayName,
    String? fcmToken,
    num? balance,
  }) {
    return UserProfile(
      uid: uid,
      email: email,
      displayName: displayName ?? this.displayName,
      fcmToken: fcmToken ?? this.fcmToken,
      balance: balance ?? this.balance,
    );
  }

  factory UserProfile.fromMap(Map<String, dynamic> map, String uid) {
    return UserProfile(
      uid: uid,
      email: map['email'] as String? ?? '',
      displayName: map['displayName'] as String? ?? '',
      fcmToken: map['fcmToken'] as String? ?? '',
      balance: map['balance'] as num? ?? 0,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'email': email,
      'displayName': displayName,
      'fcmToken': fcmToken,
      'balance': balance,
    };
  }
}