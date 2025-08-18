import 'package:flutter/material.dart';

import '../../services/functions_service.dart';

class AssistantScreen extends StatefulWidget {
  const AssistantScreen({super.key});

  @override
  State<AssistantScreen> createState() => _AssistantScreenState();
}

class _AssistantScreenState extends State<AssistantScreen> {
  final _controller = TextEditingController();
  final _messages = <_Msg>[];
  bool _loading = false;

  Future<void> _ask() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    setState(() {
      _messages.add(_Msg(sender: 'You', text: text));
      _loading = true;
      _controller.clear();
    });

    try {
      final answer = await FunctionsService().askAssistant(text);
      setState(() {
        _messages.add(_Msg(sender: 'AI', text: answer));
      });
    } catch (e) {
      setState(() {
        _messages.add(_Msg(sender: 'Error', text: e.toString()));
      });
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AI Financial Assistant')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (_, i) {
                final m = _messages[i];
                final isAi = m.sender == 'AI';
                return Align(
                  alignment: isAi ? Alignment.centerLeft : Alignment.centerRight,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isAi
                          ? Theme.of(context).colorScheme.surfaceContainerHighest
                          : Theme.of(context).colorScheme.primaryContainer,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(m.sender, style: Theme.of(context).textTheme.labelSmall),
                        const SizedBox(height: 4),
                        Text(m.text),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      decoration: const InputDecoration(
                        hintText: 'Ask for budgeting tips, saving strategies...',
                      ),
                      onSubmitted: (_) => _ask(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  FilledButton.icon(
                    onPressed: _loading ? null : _ask,
                    icon: const Icon(Icons.send),
                    label: const Text('Ask'),
                  )
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}

class _Msg {
  final String sender;
  final String text;
  _Msg({required this.sender, required this.text});
}