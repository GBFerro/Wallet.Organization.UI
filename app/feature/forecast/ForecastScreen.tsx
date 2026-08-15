import { ThemedText, ThemedView } from "@components/atoms";
import { SummaryCard } from "@components/molecules";

import { MonthCard } from "@components/organisms/MonthCard";
import {
	ForecastResponse,
	PERIOD_LABELS,
	PeriodEnum,
	Projection,
} from "@constants/api";
import { TEXT } from "@constants/text";
import { BorderRadius, Spacing } from "@constants/theme";
import { useEvent } from "@contexts/EventContext";
import { Feather } from "@expo/vector-icons";
import { usePressed } from "@hooks/usePressed";
import { useTheme } from "@hooks/useTheme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { fetchForecast } from "@services/forecast";
import { formatCurrency, formatMonthName, parseCivilDate } from "@utils/format";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
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

	projections.forEach((projection) => {
		const date = parseCivilDate(projection.date);
		const key = `${date.getFullYear()}-${date.getMonth()}`;

		const bucket = monthMap.get(key);
		if (bucket) {
			bucket.push(projection);
		} else {
			monthMap.set(key, [projection]);
		}
	});

	const result: MonthData[] = [];

	monthMap.forEach((projs, key) => {
		const [yearStr, monthIndexStr] = key.split("-");
		const year = Number.parseInt(yearStr, 10);
		const monthIndex = Number.parseInt(monthIndexStr, 10);

		const totalIncome = projs.reduce((sum, p) => sum + p.income, 0);
		const totalExpenses = projs.reduce((sum, p) => sum + p.totalExpenses, 0);
		const finalBalance = projs.at(-1)?.closingBalance ?? 0;

		result.push({
			month: formatMonthName(year, monthIndex),
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

const periodOptions = [
	PeriodEnum.RestOfQuarter,
	PeriodEnum.RestOfSemester,
	PeriodEnum.RestOfYear,
	PeriodEnum.NextThreeMonths,
	PeriodEnum.NextSixMonths,
	PeriodEnum.NextTwelveMonths,
];

export function ForecastScreen() {
	const { theme } = useTheme();
	const { onTransactionChange } = useEvent();
	const tabBarHeight = useBottomTabBarHeight();
	const retryPress = usePressed();

	const [selectedPeriod, setSelectedPeriod] = useState<PeriodEnum>(
		PeriodEnum.RestOfYear,
	);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<ForecastResponse | null>(null);

	const loadData = useCallback(async (period: PeriodEnum) => {
		setError(null);
		const result = await fetchForecast(period);

		if (!result.isSuccess) {
			setData(null);
			setError(result.errors?.[0]?.message || TEXT.forecast.errorLoad);
			return;
		}

		setData(result.data);
	}, []);

	useEffect(() => {
		setLoading(true);
		loadData(selectedPeriod).finally(() => setLoading(false));
	}, [selectedPeriod, loadData]);

	useEffect(() => {
		const unsubscribe = onTransactionChange(() => {
			loadData(selectedPeriod);
		});
		return unsubscribe;
	}, [selectedPeriod, loadData, onTransactionChange]);

	const monthsData = useMemo(() => {
		if (!data) return [];
		return groupByMonth(data.projections);
	}, [data]);

	// openingBalance/closingBalance do periodo ja vem prontos; so os totais de
	// receita e despesa precisam ser somados das projecoes.
	const totalSummary = useMemo(() => {
		if (!data) {
			return {
				totalIncome: 0,
				totalExpenses: 0,
				openingBalance: 0,
				closingBalance: 0,
			};
		}

		return {
			totalIncome: data.projections.reduce((sum, p) => sum + p.income, 0),
			totalExpenses: data.projections.reduce(
				(sum, p) => sum + p.totalExpenses,
				0,
			),
			openingBalance: data.openingBalance,
			closingBalance: data.closingBalance,
		};
	}, [data]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await loadData(selectedPeriod);
		setRefreshing(false);
	}, [selectedPeriod, loadData]);

	const renderPeriodSelector = () => (
		<View style={styles.periodSection}>
			<ThemedText
				type="caption"
				style={{ color: theme.textSecondary, marginBottom: Spacing.sm }}
			>
				{TEXT.forecast.selectPeriod}
			</ThemedText>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.periodOptions}
			>
				{periodOptions.map((period) => (
					<Pressable
						key={period}
						accessibilityRole="button"
						accessibilityLabel={PERIOD_LABELS[period]}
						onPress={() => setSelectedPeriod(period)}
						style={[
							styles.periodChip,
							{
								backgroundColor:
									selectedPeriod === period
										? theme.primary
										: theme.backgroundDefault,
								borderColor:
									selectedPeriod === period ? theme.primary : theme.border,
							},
						]}
					>
						<ThemedText
							type="caption"
							style={{
								color: selectedPeriod === period ? "#FFFFFF" : theme.text,
							}}
						>
							{PERIOD_LABELS[period]}
						</ThemedText>
					</Pressable>
				))}
			</ScrollView>
		</View>
	);

	const renderSummary = () => (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={styles.summaryRow}
		>
			<SummaryCard>
				<SummaryCard.Icon name="trending-up" color={theme.income} />
				<SummaryCard.Title>{TEXT.forecast.totalIncome}</SummaryCard.Title>
				<SummaryCard.Value>
					{formatCurrency(totalSummary.totalIncome)}
				</SummaryCard.Value>
			</SummaryCard>
			<SummaryCard>
				<SummaryCard.Icon name="trending-down" color={theme.expense} />
				<SummaryCard.Title>{TEXT.forecast.totalExpense}</SummaryCard.Title>
				<SummaryCard.Value>
					{formatCurrency(totalSummary.totalExpenses)}
				</SummaryCard.Value>
			</SummaryCard>
			<SummaryCard>
				<SummaryCard.Icon name="dollar-sign" color={theme.primary} />
				<SummaryCard.Title>{TEXT.forecast.currentBalance}</SummaryCard.Title>
				<SummaryCard.Value>
					{formatCurrency(totalSummary.openingBalance)}
				</SummaryCard.Value>
			</SummaryCard>
			<SummaryCard>
				<SummaryCard.Icon name="flag" color={theme.link} />
				<SummaryCard.Title>{TEXT.forecast.finalBalance}</SummaryCard.Title>
				<SummaryCard.Value>
					{formatCurrency(totalSummary.closingBalance)}
				</SummaryCard.Value>
			</SummaryCard>
		</ScrollView>
	);

	const renderContent = () => {
		if (loading) {
			return (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={theme.primary} />
					<ThemedText
						type="body"
						style={{ marginTop: Spacing.lg, color: theme.textSecondary }}
					>
						{TEXT.common.loading}
					</ThemedText>
				</View>
			);
		}

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
						{...retryPress.pressHandlers}
						style={[
							styles.retryButton,
							{
								backgroundColor: theme.primary,
								opacity: retryPress.pressed ? 0.8 : 1,
							},
						]}
						onPress={onRefresh}
					>
						<ThemedText type="body" style={{ color: "#FFFFFF" }}>
							{TEXT.errors.tryAgain}
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
						{TEXT.forecast.empty}
					</ThemedText>
				</View>
			);
		}

		return monthsData.map((monthData) => (
			<MonthCard
				key={`${monthData.year}-${monthData.monthIndex}`}
				year={monthData.year}
				monthIndex={monthData.monthIndex}
				monthName={monthData.month}
				projections={monthData.projections}
			>
				<MonthCard.Header />
				<MonthCard.Calendar />
				<MonthCard.DayDetail />
			</MonthCard>
		));
	};

	return (
		<ThemedView style={styles.container}>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={[
					styles.content,
					{
						paddingTop: Spacing.xl,
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
				{renderPeriodSelector()}
				{data && renderSummary()}
				{renderContent()}
			</ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	loadingContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: Spacing["5xl"],
	},
	periodSection: {
		marginBottom: Spacing.xl,
	},
	periodOptions: {
		flexDirection: "row",
		gap: Spacing.sm,
	},
	periodChip: {
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.md,
		borderRadius: BorderRadius.sm,
		borderWidth: 1,
	},
	summaryRow: {
		flexDirection: "row",
		gap: Spacing.md,
		paddingBottom: Spacing.xl,
	},
	scrollView: {
		flex: 1,
	},
	content: {
		paddingHorizontal: Spacing.xl,
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
});
