import { FAB, SearchBar, ThemedView } from "@components/atoms";
import { ScreenFlatList } from "@components/layout";
import { EmptyState, LoadingState } from "@components/molecules";
import { TransactionCard, TransactionForm } from "@components/organisms";
import {
	CardEnum,
	RecurrenceEnum,
	Transaction,
	TransactionEnum,
} from "@constants/api";
import { Spacing } from "@constants/theme";
import { useEvent } from "@contexts/EventContext";
import { useTheme } from "@hooks/useTheme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import {
	createTransaction,
	deleteTransaction as deleteTransactionAPI,
	fetchTransactions,
	updateTransaction,
} from "@services/transactions";
import React, { useCallback, useEffect, useState } from "react";
import {
	Alert,
	Modal,
	Platform,
	RefreshControl,
	StyleSheet,
	View,
} from "react-native";

export function TransactionsScreen({
	type,
}: Readonly<{ type: TransactionEnum }>) {
	const { theme } = useTheme();
	const { emitTransactionChange } = useEvent();
	const headerHeight = useHeaderHeight();
	const tabBarHeight = useBottomTabBarHeight();

	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [editingTransaction, setEditingTransaction] =
		useState<Transaction | null>(null);

	const loadTransactions = useCallback(async () => {
		setError(null);
		const result = await fetchTransactions({ type });
		if (!result.isSuccess) {
			setTransactions([]);
			return;
		}
		setTransactions(result.data);
	}, []);

	useEffect(() => {
		setLoading(true);
		loadTransactions().finally(() => setLoading(false));
	}, []);

	const filteredTransactions = transactions.filter((t) =>
		t.description?.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await loadTransactions();
		setRefreshing(false);
	}, [loadTransactions]);

	const handleAddTransaction = () => {
		setEditingTransaction(null);
		setIsFormVisible(true);
	};

	const handleEditTransaction = (transaction: Transaction) => {
		setEditingTransaction(transaction);
		setIsFormVisible(true);
	};

	const handleDeleteTransaction = (id: string) => {
		const confirmDelete = async () => {
			const result = await deleteTransactionAPI(id);
			if (result.isSuccess) {
				setTransactions((prev) => prev.filter((t) => t.id !== id));
			}
		};

		if (Platform.OS === "web") {
			if (globalThis.confirm("Deseja excluir esta transacao?")) {
				confirmDelete();
			}
		} else {
			Alert.alert("Excluir", "Deseja excluir esta transacao?", [
				{ text: "Cancelar", style: "cancel" },
				{ text: "Excluir", style: "destructive", onPress: confirmDelete },
			]);
		}
	};

	const handleSaveTransaction = async (transaction: Transaction) => {
		const payload = {
			description: transaction.description || "",
			date: transaction.date,
			type: transaction.type,
			payment: {
				amount: transaction.payment.amount,
				currency: transaction.payment.currency || "BRL",
				frequency: transaction.payment.frequency || RecurrenceEnum.OneTime,
				installment: transaction.payment.installment,
				method: transaction.payment.method,
				bankInfo: {
					name: transaction.payment.bankInfo?.name || "Banco",
					card: transaction.payment.bankInfo?.card || CardEnum.Physical,
				},
			},
		};

		if (editingTransaction) {
			const result = await updateTransaction(transaction.id, payload);
			if (result.isSuccess && result.data) {
				setTransactions((prev) =>
					prev.map((t) => (t.id === transaction.id ? result.data : t)),
				);
				emitTransactionChange();
			}
		} else {
			const result = await createTransaction(payload);
			if (result.isSuccess && result.data) {
				setTransactions((prev) => [result.data, ...prev]);
				emitTransactionChange();
			}
		}

		setIsFormVisible(false);
		setEditingTransaction(null);
	};

	const renderItem = ({ item }: { item: Transaction }) => (
		<TransactionCard
			transaction={item}
			onPress={() => handleEditTransaction(item)}
		>
			<TransactionCard.Content>
				<TransactionCard.Icon />
				<TransactionCard.Details>
					<TransactionCard.Meta />
				</TransactionCard.Details>
			</TransactionCard.Content>
			<TransactionCard.Amount />
			<TransactionCard.Actions
				onDelete={() => handleDeleteTransaction(item.id)}
			/>
		</TransactionCard>
	);

	const renderEmpty = () => (
		<View style={styles.emptyContainer}>
			{error ? (
				<EmptyState
					variant="error"
					icon="alert-circle"
					message={error}
					actionLabel="Tentar novamente"
					onAction={onRefresh}
				/>
			) : (
				<EmptyState
					variant="empty"
					icon="inbox"
					message="Nenhuma transacao encontrada"
					actionLabel="Adicionar Transacao"
					onAction={handleAddTransaction}
				/>
			)}
		</View>
	);

	if (loading) {
		return <LoadingState message="Carregando transacoes..." />;
	}

	return (
		<ThemedView style={styles.container}>
			<View
				style={[
					styles.searchContainer,
					{
						paddingTop: headerHeight + Spacing.md,
						backgroundColor: theme.backgroundRoot,
					},
				]}
			>
				<SearchBar
					value={searchQuery}
					onChangeText={setSearchQuery}
					placeholder="Buscar transacoes..."
				/>
			</View>

			<ScreenFlatList
				data={filteredTransactions}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={theme.primary}
					/>
				}
				ListEmptyComponent={renderEmpty}
				ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
				contentContainerStyle={[
					styles.listContent,
					{ paddingTop: headerHeight + 80 },
				]}
			/>

			<FAB
				icon="plus"
				bottom={tabBarHeight + Spacing.xl}
				onPress={handleAddTransaction}
			/>

			<Modal
				visible={isFormVisible}
				animationType="slide"
				presentationStyle="pageSheet"
				onRequestClose={() => setIsFormVisible(false)}
			>
				<TransactionForm
					transaction={editingTransaction}
					onSave={handleSaveTransaction}
					onCancel={() => {
						setIsFormVisible(false);
						setEditingTransaction(null);
					}}
				/>
			</Modal>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	searchContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 10,
		paddingHorizontal: Spacing.xl,
		paddingBottom: Spacing.md,
	},
	listContent: {
		flexGrow: 1,
	},
	emptyContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: Spacing["5xl"],
		gap: Spacing.lg,
	},
});
