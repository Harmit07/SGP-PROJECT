import 'package:cloud_functions/cloud_functions.dart';

class FunctionsService {
  FunctionsService({FirebaseFunctions? functions})
      : _functions = functions ?? FirebaseFunctions.instance;

  final FirebaseFunctions _functions;

  Future<String> askAssistant(String prompt) async {
    final callable = _functions.httpsCallable('aiAssistant');
    final result = await callable.call<String>({'prompt': prompt});
    return result.data;
  }

  Future<void> notifyTransfer({
    required String toUid,
    required num amount,
  }) async {
    final callable = _functions.httpsCallable('notifyTransfer');
    await callable.call({'toUid': toUid, 'amount': amount});
  }
}