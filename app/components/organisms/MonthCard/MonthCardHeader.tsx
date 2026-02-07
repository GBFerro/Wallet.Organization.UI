import { ThemedText } from "@components/atoms/ThemedText";
import { Spacing } from "@constants/theme";
import { Feather } from "@expo/vector-icons";
import { formatCurrency } from "@utils/format";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useMonthCardContext } from "./MonthCardContext";

export function MonthCardHeader() {
	const { monthData, theme, expanded, toggleExpand } = useMonthCardContext();

	return (
		<Pressable
			onPress={toggleExpand}
			style={({ pressed }) => [styles.header, { opacity: pressed ? 0.7 : 1 }]}
		>
			<View style={styles.headerLeft}>
				<ThemedText type="label">
					{monthData.month} {monthData.year}
				</ThemedText>
				<View style={styles.headerStats}>
					<View style={styles.statItem}>
						<Feather name="arrow-up-circle" size={14} color={theme.income} />
						<ThemedText type="caption" style={{ color: theme.income }}>
							{formatCurrency(monthData.totalIncome)}
						</ThemedText>
					</View>
					<View style={styles.statItem}>
						<Feather name="arrow-down-circle" size={14} color={theme.expense} />
						<ThemedText type="caption" style={{ color: theme.expense }}>
							{formatCurrency(monthData.totalExpenses)}
						</ThemedText>
					</View>
				</View>
			</View>
			<View style={styles.headerRight}>
				<ThemedText
					type="body"
					style={{
						fontWeight: "600",
						color: monthData.finalBalance >= 0 ? theme.income : theme.expense,
					}}
				>
					{formatCurrency(monthData.finalBalance)}
				</ThemedText>
				<Feather
					name={expanded ? "chevron-up" : "chevron-down"}
					size={20}
					color={theme.textSecondary}
				/>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: Spacing.lg,
	},
	headerLeft: {
		flex: 1,
		gap: Spacing.xs,
	},
	headerStats: {
		flexDirection: "row",
		gap: Spacing.lg,
	},
	statItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.xs,
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.sm,
	},
});
