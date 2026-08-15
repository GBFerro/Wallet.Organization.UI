import { Card, ThemedText } from "@components/atoms";
import { SummaryCard } from "@components/molecules";
import { MonthCard, TransactionCard } from "@components/organisms";
import {
	CardEnum,
	PaymentMethodEnum,
	RecurrenceEnum,
	Transaction,
	TransactionEnum,
} from "@constants/api";
import { useTheme } from "@hooks/useTheme";
import { formatCurrency } from "@utils/format";
import { Pressable, View } from "react-native";

export function CardExamples() {
	const { theme } = useTheme();

	return (
		<View style={{ gap: 16 }}>
			{/* Simple Card */}
			<Card elevation={1}>
				<Card.Title>Simple Card</Card.Title>
				<Card.Description>
					This is a basic card with title and description
				</Card.Description>
			</Card>

			{/* Interactive Card */}
			<Card elevation={2} onPress={() => console.log("Card pressed")}>
				<Card.Title>Interactive Card</Card.Title>
				<Card.Description>Click me! I have press animations</Card.Description>
			</Card>

			{/* Structured Card with Header/Body/Footer */}
			<Card elevation={3}>
				<Card.Header>
					<Card.Title>Structured Card</Card.Title>
				</Card.Header>
				<Card.Body>
					<ThemedText>
						This card uses Header, Body, and Footer sub-components
					</ThemedText>
					<ThemedText type="caption">You can add any content here</ThemedText>
				</Card.Body>
				<Card.Footer>
					<ThemedText type="caption" style={{ color: theme.textSecondary }}>
						Footer content
					</ThemedText>
				</Card.Footer>
			</Card>

			{/* Custom Content Card */}
			<Card elevation={1}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<View>
						<Card.Title>Custom Layout</Card.Title>
						<Card.Description>Mix and match as needed</Card.Description>
					</View>
					<ThemedText style={{ color: theme.primary, fontWeight: "bold" }}>
						R$ 100
					</ThemedText>
				</View>
			</Card>
		</View>
	);
}

export function SummaryCardExamples() {
	const { theme } = useTheme();

	return (
		<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
			{/* Income Summary */}
			<SummaryCard>
				<SummaryCard.Icon name="trending-up" color={theme.income} />
				<SummaryCard.Title>Receitas</SummaryCard.Title>
				<SummaryCard.Value>{formatCurrency(5000)}</SummaryCard.Value>
			</SummaryCard>

			{/* Expense Summary */}
			<SummaryCard>
				<SummaryCard.Icon name="trending-down" color={theme.expense} />
				<SummaryCard.Title>Despesas</SummaryCard.Title>
				<SummaryCard.Value>{formatCurrency(3200)}</SummaryCard.Value>
			</SummaryCard>

			{/* Balance Summary */}
			<SummaryCard>
				<SummaryCard.Icon name="dollar-sign" color={theme.primary} />
				<SummaryCard.Title>Saldo</SummaryCard.Title>
				<SummaryCard.Value>{formatCurrency(1800)}</SummaryCard.Value>
			</SummaryCard>

			{/* Custom Icon Size */}
			<SummaryCard>
				<SummaryCard.Icon name="credit-card" color="#9C27B0" size={24} />
				<SummaryCard.Title>Cartão</SummaryCard.Title>
				<SummaryCard.Value numberOfLines={2}>
					Valor muito longo que pode quebrar em duas linhas
				</SummaryCard.Value>
			</SummaryCard>

			{/* Custom Style */}
			<SummaryCard
				style={{ width: 200, backgroundColor: theme.backgroundSecondary }}
			>
				<SummaryCard.Icon name="bar-chart-2" color="#FF9800" />
				<SummaryCard.Title>Investimentos</SummaryCard.Title>
				<SummaryCard.Value>{formatCurrency(12500)}</SummaryCard.Value>
			</SummaryCard>
		</View>
	);
}

export function TransactionCardExamples() {
	const { theme } = useTheme();

	const incomeTransaction: Transaction = {
		id: "1",
		description: "Salário",
		date: "2026-01-31",
		type: TransactionEnum.Income,
		payment: {
			id: "p1",
			amount: 5000,
			currency: "BRL",
			frequency: RecurrenceEnum.Monthly,
			method: PaymentMethodEnum.Pix,
			bankInfo: {
				id: "b1",
				name: "Banco Principal",
				card: CardEnum.Physical,
			},
		},
	};

	const expenseTransaction: Transaction = {
		id: "2",
		description: "Supermercado",
		date: "2026-01-30",
		type: TransactionEnum.Expense,
		payment: {
			id: "p2",
			amount: 250,
			currency: "BRL",
			frequency: RecurrenceEnum.OneTime,
			method: PaymentMethodEnum.CreditCard,
			bankInfo: {
				id: "b2",
				name: "Nubank",
				card: CardEnum.Virtual,
			},
		},
	};

	const investmentTransaction: Transaction = {
		id: "3",
		description: "Ações Tesla",
		date: "2026-01-29",
		type: TransactionEnum.Investment,
		payment: {
			id: "p3",
			amount: 1000,
			currency: "BRL",
			frequency: RecurrenceEnum.OneTime,
			method: PaymentMethodEnum.DebitCard,
			bankInfo: {
				id: "b3",
				name: "XP Investimentos",
				card: CardEnum.Physical,
			},
		},
	};

	const handleEdit = (id: string) => console.log("Edit transaction:", id);
	const handleDelete = (id: string) => console.log("Delete transaction:", id);

	return (
		<View style={{ gap: 12 }}>
			{/* Default Layout - Income */}
			<TransactionCard
				transaction={incomeTransaction}
				onPress={() => handleEdit(incomeTransaction.id)}
			>
				<TransactionCard.Content>
					<TransactionCard.Icon />
					<TransactionCard.Details />
				</TransactionCard.Content>
				<TransactionCard.Amount />
				<TransactionCard.Actions
					onDelete={() => handleDelete(incomeTransaction.id)}
				/>
			</TransactionCard>

			{/* Default Layout - Expense */}
			<TransactionCard
				transaction={expenseTransaction}
				onPress={() => handleEdit(expenseTransaction.id)}
			>
				<TransactionCard.Content>
					<TransactionCard.Icon />
					<TransactionCard.Details />
				</TransactionCard.Content>
				<TransactionCard.Amount />
				<TransactionCard.Actions
					onDelete={() => handleDelete(expenseTransaction.id)}
				/>
			</TransactionCard>

			{/* Default Layout - Investment */}
			<TransactionCard
				transaction={investmentTransaction}
				onPress={() => handleEdit(investmentTransaction.id)}
			>
				<TransactionCard.Content>
					<TransactionCard.Icon />
					<TransactionCard.Details />
				</TransactionCard.Content>
				<TransactionCard.Amount />
				<TransactionCard.Actions
					onDelete={() => handleDelete(investmentTransaction.id)}
				/>
			</TransactionCard>

			{/* Custom Layout - Larger Icon */}
			<TransactionCard transaction={incomeTransaction}>
				<TransactionCard.Content>
					<TransactionCard.Icon size={28} />
					<TransactionCard.Details />
				</TransactionCard.Content>
				<TransactionCard.Amount />
			</TransactionCard>

			{/* Custom Layout - No Actions */}
			<TransactionCard transaction={expenseTransaction}>
				<TransactionCard.Content>
					<TransactionCard.Icon />
					<TransactionCard.Details />
				</TransactionCard.Content>
				<TransactionCard.Amount />
			</TransactionCard>

			{/* Custom Layout - Custom Meta */}
			<TransactionCard
				transaction={investmentTransaction}
				onPress={() => handleEdit(investmentTransaction.id)}
			>
				<TransactionCard.Content>
					<TransactionCard.Icon />
					<View style={{ flex: 1, gap: 4 }}>
						<ThemedText type="body" numberOfLines={1}>
							{investmentTransaction.description}
						</ThemedText>
						<TransactionCard.Meta>
							<View
								style={{
									paddingHorizontal: 8,
									paddingVertical: 2,
									backgroundColor: theme.primary + "20",
									borderRadius: 4,
								}}
							>
								<ThemedText
									type="caption"
									style={{ color: theme.primary, fontSize: 11 }}
								>
									CUSTOM BADGE
								</ThemedText>
							</View>
						</TransactionCard.Meta>
					</View>
				</TransactionCard.Content>
				<TransactionCard.Amount />
				<TransactionCard.Actions
					onDelete={() => handleDelete(investmentTransaction.id)}
				/>
			</TransactionCard>

			{/* Custom Layout - Custom Actions */}
			<TransactionCard transaction={expenseTransaction}>
				<TransactionCard.Content>
					<TransactionCard.Icon />
					<TransactionCard.Details />
				</TransactionCard.Content>
				<TransactionCard.Amount />
				<TransactionCard.Actions>
					<Pressable onPress={() => console.log("Custom action 1")}>
						<ThemedText style={{ color: theme.primary }}>⭐</ThemedText>
					</Pressable>
					<Pressable onPress={() => console.log("Custom action 2")}>
						<ThemedText style={{ color: theme.link }}>📝</ThemedText>
					</Pressable>
				</TransactionCard.Actions>
			</TransactionCard>
		</View>
	);
}

export function MonthCardExamples() {
	const monthData = {
		month: "Janeiro",
		year: 2026,
		monthIndex: 0,
		projections: [
			{
				date: "2026-01-15",
				openingBalance: 7500,
				income: 5000,
				totalExpenses: 2500,
				creditCardExpenses: 1500,
				cashEquivalentExpenses: 800,
				otherExpenses: 200,
				netChange: 2500,
				closingBalance: 10000,
			},
			{
				date: "2026-01-20",
				openingBalance: 10000,
				income: 0,
				totalExpenses: 500,
				creditCardExpenses: 300,
				cashEquivalentExpenses: 200,
				otherExpenses: 0,
				netChange: -500,
				closingBalance: 9500,
			},
			{
				date: "2026-01-25",
				openingBalance: 9500,
				income: 1000,
				totalExpenses: 300,
				creditCardExpenses: 200,
				cashEquivalentExpenses: 100,
				otherExpenses: 0,
				netChange: 700,
				closingBalance: 10200,
			},
		],
		totalIncome: 6000,
		totalExpenses: 3300,
		finalBalance: 2700,
	};

	return (
		<View style={{ gap: 16 }}>
			{/* Default Month Card */}
			<MonthCard
				projections={monthData.projections}
				monthName={monthData.month}
				year={monthData.year}
				monthIndex={monthData.monthIndex}
			>
				<MonthCard.Header />
				<MonthCard.Calendar />
				<MonthCard.DayDetail />
			</MonthCard>

			{/* Month Card with Custom Content */}
			<MonthCard
				projections={monthData.projections}
				monthName={monthData.month}
				year={monthData.year}
				monthIndex={monthData.monthIndex}
			>
				<MonthCard.Header />
				{/* Add custom content between header and calendar */}
				<View
					style={{ padding: 16, backgroundColor: "rgba(76, 175, 80, 0.1)" }}
				>
					<ThemedText type="caption">
						💡 Dica: Você está economizando bem este mês!
					</ThemedText>
				</View>
				<MonthCard.Calendar />
				<MonthCard.DayDetail />
			</MonthCard>

			{/* Month Card - Header Only (collapsed by default) */}
			<MonthCard
				projections={monthData.projections}
				monthName={monthData.month}
				year={monthData.year}
				monthIndex={monthData.monthIndex}
			>
				<MonthCard.Header />
				<MonthCard.Calendar />
				<MonthCard.DayDetail />
			</MonthCard>
		</View>
	);
}

export function DashboardExample() {
	const { theme } = useTheme();

	const monthData = {
		month: "Janeiro",
		year: 2026,
		monthIndex: 0,
		projections: [],
		totalIncome: 5000,
		totalExpenses: 3200,
		finalBalance: 1800,
	};

	const recentTransaction: Transaction = {
		id: "1",
		description: "Almoço",
		date: "2026-01-31",
		type: TransactionEnum.Expense,
		payment: {
			id: "p1",
			amount: 45,
			currency: "BRL",
			frequency: RecurrenceEnum.OneTime,
			method: PaymentMethodEnum.CreditCard,
			bankInfo: {
				id: "b1",
				name: "Nubank",
				card: CardEnum.Virtual,
			},
		},
	};

	return (
		<View style={{ gap: 24, padding: 16 }}>
			{/* Summary Cards Section */}
			<View>
				<ThemedText type="subheading" style={{ marginBottom: 12 }}>
					Resumo
				</ThemedText>
				<View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
					<SummaryCard>
						<SummaryCard.Icon name="trending-up" color={theme.income} />
						<SummaryCard.Title>Receitas</SummaryCard.Title>
						<SummaryCard.Value>{formatCurrency(5000)}</SummaryCard.Value>
					</SummaryCard>
					<SummaryCard>
						<SummaryCard.Icon name="trending-down" color={theme.expense} />
						<SummaryCard.Title>Despesas</SummaryCard.Title>
						<SummaryCard.Value>{formatCurrency(3200)}</SummaryCard.Value>
					</SummaryCard>
					<SummaryCard>
						<SummaryCard.Icon name="dollar-sign" color={theme.primary} />
						<SummaryCard.Title>Saldo</SummaryCard.Title>
						<SummaryCard.Value>{formatCurrency(1800)}</SummaryCard.Value>
					</SummaryCard>
				</View>
			</View>

			{/* Recent Transactions */}
			<View>
				<ThemedText type="subheading" style={{ marginBottom: 12 }}>
					Transações Recentes
				</ThemedText>
				<TransactionCard
					transaction={recentTransaction}
					onPress={() => console.log("Edit")}
				>
					<TransactionCard.Content>
						<TransactionCard.Icon />
						<TransactionCard.Details />
					</TransactionCard.Content>
					<TransactionCard.Amount />
					<TransactionCard.Actions onDelete={() => console.log("Delete")} />
				</TransactionCard>
			</View>

			{/* Month Overview */}
			<View>
				<ThemedText type="subheading" style={{ marginBottom: 12 }}>
					Visão Mensal
				</ThemedText>
				<MonthCard
					projections={monthData.projections}
					monthName={monthData.month}
					year={monthData.year}
					monthIndex={monthData.monthIndex}
				>
					<MonthCard.Header />
					<MonthCard.Calendar />
					<MonthCard.DayDetail />
				</MonthCard>
			</View>

			{/* Info Card */}
			<Card elevation={2}>
				<Card.Header>
					<Card.Title>Dica do Dia</Card.Title>
				</Card.Header>
				<Card.Body>
					<Card.Description>
						Mantenha suas despesas abaixo de 70% da sua receita para construir
						uma reserva sólida.
					</Card.Description>
				</Card.Body>
				<Card.Footer>
					<ThemedText type="caption" style={{ color: theme.textSecondary }}>
						💡 Dica financeira
					</ThemedText>
				</Card.Footer>
			</Card>
		</View>
	);
}
