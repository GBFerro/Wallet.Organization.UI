import { ThemedText } from "@components/atoms";
import { Spacing } from "@constants/theme";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import { formatCurrency } from "@utils/format";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { EASE_IN_OUT, useMonthCardContext } from "./MonthCardContext";

export function MonthCardHeader() {
	const { theme } = useTheme();
	const { projections, monthName, year, expanded, toggleExpand } =
		useMonthCardContext();

	const totalIncome = projections.reduce((sum, p) => sum + p.income, 0);
	const totalExpenses = projections.reduce(
		(sum, p) => sum + p.totalExpenses,
		0,
	);
	const finalBalance =
		projections.length > 0 ? projections.at(-1).currentAmount : 0;

	const rotation = useSharedValue(0);

	useEffect(() => {
		rotation.value = withTiming(expanded ? 180 : 0, {
			duration: 300,
			easing: EASE_IN_OUT,
		});
	}, [expanded]);

	const chevronStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${rotation.value}deg` }],
	}));

	return (
		<Pressable
			onPress={toggleExpand}
			style={({ pressed }) => [styles.header, { opacity: pressed ? 0.7 : 1 }]}
		>
			<View style={styles.headerLeft}>
				<ThemedText type="label" style={{ color: theme.text }}>
					{monthName} {year}
				</ThemedText>
				<View style={styles.headerStats}>
					<View style={styles.statItem}>
						<Feather name="arrow-up-circle" size={14} color={theme.income} />
						<ThemedText type="caption" style={{ color: theme.income }}>
							{formatCurrency(totalIncome)}
						</ThemedText>
					</View>
					<View style={styles.statItem}>
						<Feather name="arrow-down-circle" size={14} color={theme.expense} />
						<ThemedText type="caption" style={{ color: theme.expense }}>
							{formatCurrency(totalExpenses)}
						</ThemedText>
					</View>
				</View>
			</View>
			<View style={styles.headerRight}>
				<ThemedText
					type="body"
					style={{
						fontWeight: "600" as const,
						color: finalBalance >= 0 ? theme.income : theme.expense,
					}}
				>
					{formatCurrency(finalBalance)}
				</ThemedText>
				<Animated.View style={chevronStyle}>
					<Feather name="chevron-down" size={20} color={theme.textSecondary} />
				</Animated.View>
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
