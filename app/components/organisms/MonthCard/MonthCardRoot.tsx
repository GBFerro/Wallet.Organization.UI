import { Projection } from "@constants/api";
import { BorderRadius, Spacing } from "@constants/theme";
import { useTheme } from "@hooks/useTheme";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
	MonthCardContext,
	type MonthCardContextValue,
} from "./MonthCardContext";

interface MonthCardRootProps {
	projections: Projection[];
	monthName: string;
	year: number;
	monthIndex: number;
	children: React.ReactNode;
}

export function MonthCardRoot({
	projections,
	monthName,
	year,
	monthIndex,
	children,
}: Readonly<MonthCardRootProps>) {
	const { theme } = useTheme();
	const [expanded, setExpanded] = useState(false);
	const [selectedDay, setSelectedDay] = useState<Projection | null>(null);

	const toggleExpand = useCallback(() => {
		setExpanded((prev) => !prev);
	}, []);

	const value: MonthCardContextValue = useMemo(
		() => ({
			projections,
			monthName,
			year,
			monthIndex,
			expanded,
			toggleExpand,
			selectedDay,
			setSelectedDay,
		}),
		[projections, monthName, year, monthIndex, expanded, selectedDay],
	);

	return (
		<MonthCardContext.Provider value={value}>
			<View
				style={[styles.container, { backgroundColor: theme.backgroundDefault }]}
			>
				{children}
			</View>
		</MonthCardContext.Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: BorderRadius.sm,
		marginBottom: Spacing.lg,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 1,
	},
});
