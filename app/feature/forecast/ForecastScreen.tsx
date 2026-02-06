import { ThemedText, ThemedView } from "@components/atoms";
import { SummaryCard } from "@components/molecules";
import { MonthCard } from "@components/organisms";
import {
	ForecastResponse,
	PERIOD_LABELS,
	PeriodEnum,
	Projection,
} from "@constants/api";
import { BorderRadius, Spacing } from "@constants/theme";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { fetchForecast } from "@services/forecast";
import { formatCurrency } from "@utils/format";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Modal,
	Pressable,
	RefreshControl,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";

interface MonthData {
	month: string;
	year: number;
	monthIndex: number;
	projections: Projection[];
	totalIncome: number;
	totalExpenses: number;
	finalBalance: number;
}

const groupByMonth = (projections: Projection[]): MonthData[] => {
	const monthMap = new Map<string, Projection[]>();
	const monthNames = [
		"Janeiro",
		"Fevereiro",
		"Marco",
		"Abril",
		"Maio",
		"Junho",
		"Julho",
		"Agosto",
		"Setembro",
		"Outubro",
		"Novembro",
		"Dezembro",
	];

	projections.forEach((projection) => {
		const date = new Date(projection.date);
		const key = `${date.getFullYear()}-${date.getMonth()}`;

		if (!monthMap.has(key)) {
			monthMap.set(key, []);
		}
		monthMap.get(key).push(projection);
	});

	const result: MonthData[] = [];

	monthMap.forEach((projs, key) => {
		const [yearStr, monthIndexStr] = key.split("-");
		const year = Number.parseInt(yearStr, 10);
		const monthIndex = Number.parseInt(monthIndexStr, 10);

		const totalIncome = projs.reduce((sum, p) => sum + p.income, 0);
		const totalExpenses = projs.reduce((sum, p) => sum + p.totalExpenses, 0);
		const finalBalance = projs.at(-1)?.currentAmount || 0;

		result.push({
			month: monthNames[monthIndex],
			year,
			monthIndex,
			projections: projs,
			totalIncome,
			totalExpenses,
			finalBalance,
		});
	});

	return result.sort((a, b) => {
		if (a.year !== b.year) return a.year - b.year;
		return a.monthIndex - b.monthIndex;
	});
};

export function ForecastScreen() {
	const { theme } = useTheme();
	const headerHeight = useHeaderHeight();
	const tabBarHeight = useBottomTabBarHeight();

	const [selectedPeriod, setSelectedPeriod] = useState<PeriodEnum>(
		PeriodEnum.ThisYear,
	);
	const [isPeriodModalVisible, setIsPeriodModalVisible] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<ForecastResponse | null>(null);

	const loadData = useCallback(async (period: PeriodEnum) => {
		try {
			setError(null);
			const result = await fetchForecast(period);
			if (result?.data?.projections && result.data?.projections.length > 0) {
				setData(result.data);
			} else {
				setData(null);
				setError("Nenhuma projecao financeira encontrada para este periodo.");
			}
		} catch (err) {
			console.error("Error loading forecast:", err);
			setData(null);
			setError("Erro ao carregar previsoes. Tente novamente.");
		}
	}, []);

	useEffect(() => {
		setLoading(true);
		loadData(selectedPeriod).finally(() => setLoading(false));
	}, []);

	const monthsData = useMemo(() => {
		if (!data) return [];
		return groupByMonth(data.projections);
	}, [data]);

	const totalSummary = useMemo(() => {
		if (!data)
			return {
				totalIncome: 0,
				totalExpenses: 0,
				netBalance: 0,
				currentBalance: 0,
			};

		const totalIncome = data.projections.reduce((sum, p) => sum + p.income, 0);
		const totalExpenses = data.projections.reduce(
			(sum, p) => sum + p.totalExpenses,
			0,
		);
		const netBalance = totalIncome - totalExpenses;
		const currentBalance = data.projections[-1]?.currentAmount || 0;

		return { totalIncome, totalExpenses, netBalance, currentBalance };
	}, [data]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await loadData(selectedPeriod);
		setRefreshing(false);
	}, [selectedPeriod, loadData]);

	const handlePeriodSelect = async (period: PeriodEnum) => {
		setSelectedPeriod(period);
		setIsPeriodModalVisible(false);
		setLoading(true);
		await loadData(period);
		setLoading(false);
	};

	const renderContent = () => {
		if (error) {
			return (
				<View
					style={[
						styles.emptyState,
						{ backgroundColor: theme.backgroundSecondary },
					]}
				>
					<Feather name="alert-circle" size={48} color={theme.textSecondary} />
					<ThemedText
						type="body"
						style={{
							color: theme.textSecondary,
							textAlign: "center",
							marginTop: Spacing.lg,
						}}
					>
						{error}
					</ThemedText>
					<Pressable
						style={({ pressed }) => [
							styles.retryButton,
							{ backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
						]}
						onPress={onRefresh}
					>
						<ThemedText type="body" style={{ color: "#FFFFFF" }}>
							Tentar novamente
						</ThemedText>
					</Pressable>
				</View>
			);
		}

		if (monthsData.length === 0) {
			return (
				<View
					style={[
						styles.emptyState,
						{ backgroundColor: theme.backgroundSecondary },
					]}
				>
					<Feather name="calendar" size={48} color={theme.textSecondary} />
					<ThemedText
						type="body"
						style={{
							color: theme.textSecondary,
							textAlign: "center",
							marginTop: Spacing.lg,
						}}
					>
						Nenhuma projecao disponivel para este periodo.
					</ThemedText>
				</View>
			);
		}

		return monthsData.map((monthData) => (
			<MonthCard
				key={`${monthData.year}-${monthData.monthIndex}`}
				monthData={monthData}
			>
				<MonthCard.Header />
				<MonthCard.Calendar />
				<MonthCard.DayDetail />
			</MonthCard>
		));
	};

	const periodOptions = Object.values(PeriodEnum).filter(
		(p) => p !== PeriodEnum.None,
	);

	if (loading) {
		return (
			<ThemedView style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={theme.primary} />
				<ThemedText
					type="body"
					style={{ marginTop: Spacing.lg, color: theme.textSecondary }}
				>
					Carregando previsao...
				</ThemedText>
			</ThemedView>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={[
					styles.content,
					{
						paddingTop: headerHeight + Spacing.xl,
						paddingBottom: tabBarHeight + Spacing.xl,
					},
				]}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={theme.primary}
					/>
				}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.periodRow}>
					<ThemedText type="label">Periodo</ThemedText>
					<Pressable
						style={({ pressed }) => [
							styles.periodButton,
							{
								backgroundColor: theme.backgroundDefault,
								opacity: pressed ? 0.7 : 1,
							},
						]}
						onPress={() => setIsPeriodModalVisible(true)}
					>
						<ThemedText type="body">{PERIOD_LABELS[selectedPeriod]}</ThemedText>
						<Feather name="chevron-down" size={20} color={theme.text} />
					</Pressable>
				</View>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.summaryScroll}
					contentContainerStyle={styles.summaryContainer}
				>
					<SummaryCard>
						<SummaryCard.Icon name="trending-up" color={theme.income} />
						<SummaryCard.Title>Receita Total</SummaryCard.Title>
						<SummaryCard.Value>
							{formatCurrency(totalSummary.totalIncome)}
						</SummaryCard.Value>
					</SummaryCard>

					<SummaryCard>
						<SummaryCard.Icon name="trending-down" color={theme.expense} />
						<SummaryCard.Title>Despesa Total</SummaryCard.Title>
						<SummaryCard.Value>
							{formatCurrency(totalSummary.totalExpenses)}
						</SummaryCard.Value>
					</SummaryCard>

					<SummaryCard>
						<SummaryCard.Icon
							name="activity"
							color={
								totalSummary.netBalance >= 0 ? theme.income : theme.expense
							}
						/>
						<SummaryCard.Title>Saldo Liquido</SummaryCard.Title>
						<SummaryCard.Value>
							{formatCurrency(totalSummary.netBalance)}
						</SummaryCard.Value>
					</SummaryCard>

					<SummaryCard>
						<SummaryCard.Icon name="dollar-sign" color={theme.primary} />
						<SummaryCard.Title>Saldo Atual</SummaryCard.Title>
						<SummaryCard.Value>
							{formatCurrency(totalSummary.currentBalance)}
						</SummaryCard.Value>
					</SummaryCard>
				</ScrollView>

				<ThemedText type="label" style={styles.sectionTitle}>
					Projecao Mensal
				</ThemedText>

				{renderContent()}
			</ScrollView>

			<Modal
				visible={isPeriodModalVisible}
				transparent
				animationType="slide"
				onRequestClose={() => setIsPeriodModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View
						style={[
							styles.modalContent,
							{ backgroundColor: theme.backgroundRoot },
						]}
					>
						<View style={styles.modalHeader}>
							<ThemedText type="label">Selecionar Periodo</ThemedText>
							<Pressable
								onPress={() => setIsPeriodModalVisible(false)}
								style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
							>
								<Feather name="x" size={24} color={theme.text} />
							</Pressable>
						</View>
						<FlatList
							data={periodOptions}
							keyExtractor={(item) => item}
							renderItem={({ item }) => (
								<Pressable
									style={({ pressed }) => [
										styles.periodOption,
										{
											backgroundColor:
												item === selectedPeriod
													? theme.backgroundSecondary
													: "transparent",
											opacity: pressed ? 0.7 : 1,
										},
									]}
									onPress={() => handlePeriodSelect(item)}
								>
									<ThemedText type="body">{PERIOD_LABELS[item]}</ThemedText>
									{item === selectedPeriod ? (
										<Feather name="check" size={20} color={theme.primary} />
									) : null}
								</Pressable>
							)}
						/>
					</View>
				</View>
			</Modal>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	scrollView: {
		flex: 1,
	},
	content: {
		paddingHorizontal: Spacing.xl,
	},
	periodRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: Spacing.lg,
	},
	periodButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.sm,
		borderRadius: BorderRadius.sm,
		gap: Spacing.xs,
	},
	summaryScroll: {
		marginHorizontal: -Spacing.xl,
		marginBottom: Spacing.xl,
	},
	summaryContainer: {
		paddingHorizontal: Spacing.xl,
		gap: Spacing.md,
	},
	sectionTitle: {
		marginBottom: Spacing.lg,
	},
	emptyState: {
		alignItems: "center",
		justifyContent: "center",
		padding: Spacing["3xl"],
		borderRadius: BorderRadius.md,
		marginBottom: Spacing.xl,
	},
	retryButton: {
		paddingHorizontal: Spacing.xl,
		paddingVertical: Spacing.md,
		borderRadius: BorderRadius.sm,
		marginTop: Spacing.xl,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-end",
	},
	modalContent: {
		borderTopLeftRadius: BorderRadius.lg,
		borderTopRightRadius: BorderRadius.lg,
		maxHeight: "60%",
		paddingBottom: Spacing["3xl"],
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: Spacing.xl,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(128, 128, 128, 0.2)",
	},
	periodOption: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: Spacing.xl,
		paddingVertical: Spacing.lg,
	},
});
