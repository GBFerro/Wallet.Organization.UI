import { BorderRadius, Spacing } from "@constants/theme";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import { formatCurrency, formatDate } from "@utils/format";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useMonthCardContext } from "./MonthCardContext";

interface DetailRowProps {
	icon: string;
	iconColor: string;
	label: string;
	value: string;
	valueColor: string;
	valueWeight?: "400" | "500" | "600" | "700";
	backgroundColor: string;
}

function DetailRow({
	icon,
	iconColor,
	label,
	value,
	valueColor,
	valueWeight = "600",
	backgroundColor,
}: Readonly<DetailRowProps>) {
	const { theme } = useTheme();
	return (
		<View style={[styles.detailRow, { backgroundColor }]}>
			<View style={styles.detailRowLeft}>
				<Feather name={icon as any} size={20} color={iconColor} />
				<Text style={[styles.bodyText, { color: theme.text }]}>{label}</Text>
			</View>
			<Text
				style={[
					styles.bodyText,
					{ color: valueColor, fontWeight: valueWeight },
				]}
			>
				{value}
			</Text>
		</View>
	);
}

interface DetailSubRowProps {
	icon: string;
	label: string;
	value: string;
}

function DetailSubRow({ icon, label, value }: Readonly<DetailSubRowProps>) {
	const { theme } = useTheme();
	return (
		<View
			style={[
				styles.detailSubRow,
				{ backgroundColor: theme.backgroundSecondary },
			]}
		>
			<View style={styles.detailRowLeft}>
				<Feather name={icon as any} size={16} color={theme.textSecondary} />
				<Text style={[styles.captionText, { color: theme.textSecondary }]}>
					{label}
				</Text>
			</View>
			<Text style={[styles.captionText, { color: theme.text }]}>{value}</Text>
		</View>
	);
}

export function MonthCardDayDetail() {
	const { selectedDay, setSelectedDay } = useMonthCardContext();
	const { theme } = useTheme();

	return (
		<Modal
			visible={selectedDay !== null}
			transparent
			animationType="fade"
			onRequestClose={() => setSelectedDay(null)}
		>
			<Pressable
				style={styles.modalOverlay}
				onPress={() => setSelectedDay(null)}
			>
				<Pressable
					style={[
						styles.dayDetailCard,
						{ backgroundColor: theme.backgroundRoot },
					]}
					onPress={(e) => e.stopPropagation()}
				>
					{selectedDay && (
						<>
							<View style={styles.dayDetailHeader}>
								<Text style={[styles.subheadingText, { color: theme.text }]}>
									{formatDate(selectedDay.date)}
								</Text>
								<Pressable
									onPress={() => setSelectedDay(null)}
									style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
								>
									<Feather name="x" size={24} color={theme.text} />
								</Pressable>
							</View>

							<View style={styles.dayDetailContent}>
								<DetailRow
									icon="arrow-up-circle"
									iconColor={theme.income}
									label="Receitas"
									value={formatCurrency(selectedDay.income)}
									valueColor={theme.income}
									backgroundColor={theme.income + "15"}
								/>

								<DetailRow
									icon="arrow-down-circle"
									iconColor={theme.expense}
									label="Despesas Totais"
									value={formatCurrency(selectedDay.totalExpenses)}
									valueColor={theme.expense}
									backgroundColor={theme.expense + "15"}
								/>

								<DetailSubRow
									icon="credit-card"
									label="Cartao"
									value={formatCurrency(selectedDay.cardExpenses)}
								/>

								<DetailSubRow
									icon="smartphone"
									label="Debito"
									value={formatCurrency(selectedDay.debitExpenses)}
								/>

								<DetailSubRow
									icon="more-horizontal"
									label="Outras"
									value={formatCurrency(selectedDay.otherExpenses)}
								/>

								<View style={styles.detailDivider} />

								<DetailRow
									icon="activity"
									iconColor={
										selectedDay.net >= 0 ? theme.income : theme.expense
									}
									label="Saldo do Dia"
									value={`${selectedDay.net >= 0 ? "+" : ""}${formatCurrency(selectedDay.net)}`}
									valueColor={
										selectedDay.net >= 0 ? theme.income : theme.expense
									}
									backgroundColor={
										selectedDay.net >= 0
											? theme.income + "15"
											: theme.expense + "15"
									}
								/>

								<DetailRow
									icon="dollar-sign"
									iconColor={theme.primary}
									label="Saldo Acumulado"
									value={formatCurrency(selectedDay.currentAmount)}
									valueColor={
										selectedDay.currentAmount >= 0
											? theme.income
											: theme.expense
									}
									valueWeight="700"
									backgroundColor={theme.primary + "15"}
								/>
							</View>
						</>
					)}
				</Pressable>
			</Pressable>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
		padding: Spacing.xl,
	},
	dayDetailCard: {
		width: "100%",
		maxWidth: 360,
		borderRadius: BorderRadius.md,
		overflow: "hidden",
	},
	dayDetailHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: Spacing.lg,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(128, 128, 128, 0.2)",
	},
	dayDetailContent: {
		padding: Spacing.md,
		gap: Spacing.sm,
	},
	detailRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: Spacing.md,
		borderRadius: BorderRadius.xs,
	},
	detailSubRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: Spacing.sm,
		paddingHorizontal: Spacing.md,
		borderRadius: BorderRadius.xs,
		marginLeft: Spacing.xl,
	},
	detailRowLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.sm,
	},
	detailDivider: {
		height: 1,
		backgroundColor: "rgba(128, 128, 128, 0.2)",
		marginVertical: Spacing.sm,
	},
	bodyText: {
		fontSize: 14,
	},
	captionText: {
		fontSize: 12,
	},
	subheadingText: {
		fontSize: 18,
		fontWeight: "600" as const,
	},
});
