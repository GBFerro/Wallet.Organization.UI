import { FAB, SearchBar, ThemedView } from "@components/atoms";
import { ScreenFlatList } from "@components/layout";
import { EmptyState, LoadingState } from "@components/molecules";
import { TransactionCard, TransactionForm } from "@components/organisms";
import {
	Transaction,
	TransactionEnum,
	TransactionPayload,
} from "@constants/api";
import { TEXT } from "@constants/text";
import { Spacing } from "@constants/theme";
import { useEvent } from "@contexts/EventContext";
import { useTheme } from "@hooks/useTheme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
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
			setError(result.errors?.[0]?.message || TEXT.transactions.errorLoad);
			return;
		}
		setTransactions(result.data);
	}, [type]);

	useEffect(() => {
		setLoading(true);
		loadTransactions().finally(() => setLoading(false));
	}, [loadTransactions]);

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
			if (!result.isSuccess || !result.data.deleted) {
				setError(TEXT.transactions.deleteFailed);
				return;
			}
			setTransactions((prev) => prev.filter((t) => t.id !== id));
			emitTransactionChange();
		};

		if (Platform.OS === "web") {
			if (globalThis.confirm(TEXT.transactions.deleteMessage)) {
				confirmDelete();
			}
		} else {
			Alert.alert(
				TEXT.transactions.deleteTitle,
				TEXT.transactions.deleteMessage,
				[
					{ text: TEXT.common.cancel, style: "cancel" },
					{
						text: TEXT.common.delete,
						style: "destructive",
						onPress: confirmDelete,
					},
				],
			);
		}
	};

	// A resposta de criacao omite frequency/installment, entao a lista e recarregada
	// em vez de receber o item devolvido pela API.
	const handleSaveTransaction = async (payload: TransactionPayload) => {
		const result = editingTransaction
			? await updateTransaction(editingTransaction.id, payload)
			: await createTransaction(payload);

		if (!result.isSuccess) {
			return;
		}

		setIsFormVisible(false);
		setEditingTransaction(null);
		emitTransactionChange();
		await loadTransactions();
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
					actionLabel={TEXT.errors.tryAgain}
					onAction={onRefresh}
				/>
			) : (
				<EmptyState
					variant="empty"
					icon="inbox"
					message={TEXT.transactions.emptyTitle}
					actionLabel={TEXT.transactions.addButton}
					onAction={handleAddTransaction}
				/>
			)}
		</View>
	);

	if (loading) {
		return <LoadingState message={TEXT.common.loading} />;
	}

	return (
		<ThemedView style={styles.container}>
			<View
				style={[
					styles.searchContainer,
					{
						paddingTop: Spacing.md,
						backgroundColor: theme.backgroundRoot,
					},
				]}
			>
				<SearchBar
					value={searchQuery}
					onChangeText={setSearchQuery}
					placeholder={TEXT.transactions.searchPlaceholder}
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
				contentContainerStyle={[styles.listContent, { paddingTop: 80 }]}
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
