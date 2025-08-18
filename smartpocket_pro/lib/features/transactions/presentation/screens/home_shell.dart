import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_theme.dart';
import '../../domain/entities/transaction.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final transactionsProvider = StateNotifierProvider<TransactionsController, List<TransactionEntity>>((ref) {
	return TransactionsController(_generateSampleData());
});

class TransactionsController extends StateNotifier<List<TransactionEntity>> {
	TransactionsController(super.state);

	void add(TransactionEntity t) => state = [...state, t];
	void remove(String id) => state = state.where((e) => e.id != id).toList();
	void update(TransactionEntity t) => state = [for (final e in state) if (e.id == t.id) t else e];
}

final budgetProvider = StateProvider<double>((ref) => 1500);

final themeToggleProvider = Provider<VoidCallback>((ref) {
	const storage = FlutterSecureStorage();
	return () async {
		final current = ref.read(themeModeProvider);
		final next = current == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
		ref.read(themeModeProvider.notifier).state = next;
		await storage.write(key: 'theme_mode', value: next.name);
	};
});

class HomeShell extends ConsumerStatefulWidget {
	const HomeShell({super.key});

	@override
	ConsumerState<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends ConsumerState<HomeShell> with SingleTickerProviderStateMixin {
	late final TabController _tabController;

	@override
	void initState() {
		super.initState();
		_tabController = TabController(length: 3, vsync: this);
	}

	@override
	Widget build(BuildContext context) {
		final themeMode = ref.watch(themeModeProvider);
		final toggleTheme = ref.watch(themeToggleProvider);
		return Scaffold(
			appBar: AppBar(
				title: const Text('SmartPocket Pro'),
				actions: [
					IconButton(
						icon: Icon(themeMode == ThemeMode.dark ? Icons.wb_sunny : Icons.nightlight_round),
						onPressed: toggleTheme,
					)
				],
				bottom: TabBar(controller: _tabController, tabs: const [
					Tab(icon: Icon(Icons.dashboard), text: 'Dashboard'),
					Tab(icon: Icon(Icons.analytics_outlined), text: 'Analysis'),
					Tab(icon: Icon(Icons.settings), text: 'Budget'),
				]),
			),
			body: TabBarView(
				controller: _tabController,
				children: const [
					_DashboardTab(),
					_AnalysisTab(),
					_BudgetTab(),
				],
			),
			bottomNavigationBar: Material(
				color: Theme.of(context).colorScheme.surface,
				child: TabBar(
					controller: _tabController,
					tabs: const [
						Tab(icon: Icon(Icons.dashboard)),
						Tab(icon: Icon(Icons.analytics_outlined)),
						Tab(icon: Icon(Icons.settings)),
					],
				),
			),
			floatingActionButton: FloatingActionButton.extended(
				onPressed: () async {
					await showModalBottomSheet(
						context: context,
						isScrollControlled: true,
						builder: (_) => const _AddOrEditTransactionSheet(),
					);
				},
				icon: const Icon(Icons.add),
				label: const Text('Add'),
			),
		);
	}
}

class _DashboardTab extends ConsumerWidget {
	const _DashboardTab();

	@override
	Widget build(BuildContext context, WidgetRef ref) {
		final txs = ref.watch(transactionsProvider);
		final income = txs.where((t) => t.type == TransactionType.income).fold<double>(0, (s, t) => s + t.amount);
		final expenses = txs.where((t) => t.type == TransactionType.expense).fold<double>(0, (s, t) => s + t.amount);
		final savings = income - expenses;
		return ListView(
			padding: const EdgeInsets.all(16),
			children: [
				_SummaryCard(income: income, expenses: expenses, savings: savings),
				const SizedBox(height: 16),
				Text('Recent Transactions', style: Theme.of(context).textTheme.titleMedium),
				const SizedBox(height: 8),
				for (final t in txs.reversed.take(10)) _TxTile(t: t),
			],
		);
	}
}

class _SummaryCard extends StatelessWidget {
	final double income;
	final double expenses;
	final double savings;
	const _SummaryCard({required this.income, required this.expenses, required this.savings});

	@override
	Widget build(BuildContext context) {
		final cs = Theme.of(context).colorScheme;
		return Card(
			shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
			child: Padding(
				padding: const EdgeInsets.all(16),
				child: Row(
					mainAxisAlignment: MainAxisAlignment.spaceAround,
					children: [
						_metric('Income', income, cs.primary),
						_metric('Expenses', expenses, cs.error),
						_metric('Savings', savings, cs.tertiary),
					],
				),
			),
		);
	}

	Widget _metric(String title, double value, Color color) {
		return Column(
			children: [
				Text(title),
				const SizedBox(height: 8),
				Text(
					value.toStringAsFixed(2),
					style: TextStyle(fontWeight: FontWeight.bold, color: color, fontSize: 18),
				),
			],
		);
	}
}

class _AnalysisTab extends ConsumerWidget {
	const _AnalysisTab();

	@override
	Widget build(BuildContext context, WidgetRef ref) {
		final txs = ref.watch(transactionsProvider);
		final categoryToTotal = <TransactionCategory, double>{};
		for (final t in txs.where((e) => e.type == TransactionType.expense)) {
			categoryToTotal.update(t.category, (v) => v + t.amount, ifAbsent: () => t.amount);
		}
		final sections = categoryToTotal.entries.map((e) {
			return PieChartSectionData(
				value: e.value,
				title: e.key.name,
				radius: 60,
				titleStyle: const TextStyle(fontSize: 12),
			);
		}).toList();
		return Padding(
			padding: const EdgeInsets.all(16),
			child: Card(
				shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
				child: Padding(
					padding: const EdgeInsets.all(16),
					child: Column(
						children: [
							const Text('Monthly Spending by Category'),
							const SizedBox(height: 16),
							Expanded(
								child: PieChart(
									PieChartData(
										sections: sections,
										sectionsSpace: 2,
										centerSpaceRadius: 40,
									),
								),
							),
						],
					),
				),
			),
		);
	}
}

class _BudgetTab extends ConsumerWidget {
	const _BudgetTab();

	@override
	Widget build(BuildContext context, WidgetRef ref) {
		final txs = ref.watch(transactionsProvider);
		final expenses = txs.where((t) => t.type == TransactionType.expense).fold<double>(0, (s, t) => s + t.amount);
		final budget = ref.watch(budgetProvider);
		final remaining = budget - expenses;
		final overspent = remaining < 0;
		return Padding(
			padding: const EdgeInsets.all(16),
			child: Column(
				crossAxisAlignment: CrossAxisAlignment.stretch,
				children: [
					Card(
						child: Padding(
							padding: const EdgeInsets.all(16),
							child: Column(
								crossAxisAlignment: CrossAxisAlignment.start,
								children: [
									Text('Monthly Budget: \$${budget.toStringAsFixed(0)}'),
									const SizedBox(height: 8),
									LinearProgressIndicator(
										value: (expenses / budget).clamp(0.0, 1.0),
									),
									const SizedBox(height: 8),
									Text(overspent
										? 'Overspent by \$${(-remaining).toStringAsFixed(2)}'
										: 'Remaining: \$${remaining.toStringAsFixed(2)}'),
								],
							),
						),
					),
					const SizedBox(height: 12),
					ElevatedButton.icon(
						onPressed: () async {
							final controller = TextEditingController(text: budget.toStringAsFixed(0));
							final newBudget = await showDialog<double>(
								context: context,
								builder: (_) => AlertDialog(
										title: const Text('Set Monthly Budget'),
										content: TextField(
											controller: controller,
											keyboardType: const TextInputType.numberWithOptions(decimal: true),
											decoration: const InputDecoration(labelText: 'Amount'),
										),
										actions: [
											TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
											TextButton(
												onPressed: () {
													final v = double.tryParse(controller.text);
													Navigator.pop(context, v);
												},
												child: const Text('Save')),
										],
									),
							);
							if (newBudget != null && newBudget > 0) {
								ref.read(budgetProvider.notifier).state = newBudget;
							}
						},
						icon: const Icon(Icons.savings_outlined),
						label: const Text('Set Budget'),
					),
				],
			),
		);
	}
}

class _TxTile extends ConsumerWidget {
	final TransactionEntity t;
	const _TxTile({required this.t});

	IconData _iconFor(TransactionCategory c) {
		switch (c) {
			case TransactionCategory.food:
				return Icons.restaurant_menu;
			case TransactionCategory.shopping:
				return Icons.shopping_bag_outlined;
			case TransactionCategory.bills:
				return Icons.receipt_long_outlined;
			case TransactionCategory.travel:
				return Icons.flight_takeoff;
			case TransactionCategory.salary:
				return Icons.payments_outlined;
			case TransactionCategory.other:
				return Icons.category_outlined;
		}
	}

	@override
	Widget build(BuildContext context, WidgetRef ref) {
		final cs = Theme.of(context).colorScheme;
		final isExpense = t.type == TransactionType.expense;
		return ListTile(
			leading: CircleAvatar(
				backgroundColor: isExpense ? cs.errorContainer : cs.primaryContainer,
				child: Icon(_iconFor(t.category), color: isExpense ? cs.onErrorContainer : cs.onPrimaryContainer),
			),
			title: Text(t.title),
			subtitle: Text('${t.date.year}-${t.date.month}-${t.date.day}'),
			trailing: Text(
				'${isExpense ? '-' : '+'}\$${t.amount.toStringAsFixed(2)}',
				style: TextStyle(color: isExpense ? cs.error : cs.primary, fontWeight: FontWeight.bold),
			),
			onTap: () async {
				await showModalBottomSheet(
					context: context,
					isScrollControlled: true,
					builder: (_) => _AddOrEditTransactionSheet(existing: t),
				);
			},
			onLongPress: () => ref.read(transactionsProvider.notifier).remove(t.id),
		);
	}
}

class _AddOrEditTransactionSheet extends ConsumerStatefulWidget {
	final TransactionEntity? existing;
	const _AddOrEditTransactionSheet({this.existing});

	@override
	ConsumerState<_AddOrEditTransactionSheet> createState() => _AddOrEditTransactionSheetState();
}

class _AddOrEditTransactionSheetState extends ConsumerState<_AddOrEditTransactionSheet> {
	final _formKey = GlobalKey<FormState>();
	late final TextEditingController _titleController;
	late final TextEditingController _amountController;
	late DateTime _date;
	late TransactionCategory _category;
	late TransactionType _type;

	@override
	void initState() {
		super.initState();
		final e = widget.existing;
		_titleController = TextEditingController(text: e?.title ?? '');
		_amountController = TextEditingController(text: e?.amount.toString() ?? '');
		_date = e?.date ?? DateTime.now();
		_category = e?.category ?? TransactionCategory.food;
		_type = e?.type ?? TransactionType.expense;
	}

	@override
	Widget build(BuildContext context) {
		final isEditing = widget.existing != null;
		return Padding(
			padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
			child: Padding(
				padding: const EdgeInsets.all(16),
				child: Form(
					key: _formKey,
					child: SingleChildScrollView(
						child: Column(
							crossAxisAlignment: CrossAxisAlignment.stretch,
							children: [
								Row(
									mainAxisAlignment: MainAxisAlignment.spaceBetween,
									children: [
										Text(isEditing ? 'Edit Transaction' : 'Add Transaction',
											style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
										IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close))
									],
								),
								const SizedBox(height: 12),
								TextFormField(
									controller: _titleController,
									decoration: const InputDecoration(labelText: 'Title'),
									validator: (v) => (v == null || v.isEmpty) ? 'Enter title' : null,
								),
								const SizedBox(height: 12),
								TextFormField(
									controller: _amountController,
									keyboardType: const TextInputType.numberWithOptions(decimal: true),
									decoration: const InputDecoration(labelText: 'Amount'),
									validator: (v) => (double.tryParse(v ?? '') == null) ? 'Enter valid amount' : null,
								),
								const SizedBox(height: 12),
								DropdownButtonFormField<TransactionCategory>(
									value: _category,
									items: TransactionCategory.values
										.map((c) => DropdownMenuItem(value: c, child: Text(c.name)))
										.toList(),
									onChanged: (v) => setState(() => _category = v ?? _category),
									decoration: const InputDecoration(labelText: 'Category'),
								),
								const SizedBox(height: 12),
								DropdownButtonFormField<TransactionType>(
									value: _type,
									items: TransactionType.values
										.map((c) => DropdownMenuItem(value: c, child: Text(c.name)))
										.toList(),
									onChanged: (v) => setState(() => _type = v ?? _type),
									decoration: const InputDecoration(labelText: 'Type'),
								),
								const SizedBox(height: 12),
								Row(
									children: [
										Expanded(child: Text('Date: ${_date.year}-${_date.month}-${_date.day}')),
										TextButton(
											onPressed: () async {
												final picked = await showDatePicker(
													context: context,
													firstDate: DateTime(_date.year - 5),
													lastDate: DateTime(_date.year + 5),
													initialDate: _date,
												);
												if (picked != null) setState(() => _date = picked);
											},
											child: const Text('Pick'),
										)
									],
								),
								const SizedBox(height: 20),
								ElevatedButton(
									onPressed: () {
										if (!_formKey.currentState!.validate()) return;
										final updated = TransactionEntity(
											id: widget.existing?.id ?? UniqueKey().toString(),
											title: _titleController.text,
											amount: double.parse(_amountController.text),
											date: _date,
											category: _category,
											type: _type,
										);
										if (widget.existing == null) {
											ref.read(transactionsProvider.notifier).add(updated);
										} else {
											ref.read(transactionsProvider.notifier).update(updated);
										}
										Navigator.pop(context);
									},
									child: Text(isEditing ? 'Update' : 'Save'),
								)
							],
						),
					),
				),
			),
		);
	}
}

List<TransactionEntity> _generateSampleData() {
	final now = DateTime.now();
	return [
		TransactionEntity(
			id: '1',
			title: 'Salary',
			amount: 3000,
			date: DateTime(now.year, now.month, 1),
			category: TransactionCategory.salary,
			type: TransactionType.income,
		),
		TransactionEntity(
			id: '2',
			title: 'Groceries',
			amount: 120.50,
			date: DateTime(now.year, now.month, 3),
			category: TransactionCategory.food,
			type: TransactionType.expense,
		),
		TransactionEntity(
			id: '3',
			title: 'Electricity Bill',
			amount: 75.20,
			date: DateTime(now.year, now.month, 5),
			category: TransactionCategory.bills,
			type: TransactionType.expense,
		),
		TransactionEntity(
			id: '4',
			title: 'Online Shopping',
			amount: 230.00,
			date: DateTime(now.year, now.month, 10),
			category: TransactionCategory.shopping,
			type: TransactionType.expense,
		),
		TransactionEntity(
			id: '5',
			title: 'Taxi',
			amount: 35.80,
			date: DateTime(now.year, now.month, 12),
			category: TransactionCategory.travel,
			type: TransactionType.expense,
		),
	];
}