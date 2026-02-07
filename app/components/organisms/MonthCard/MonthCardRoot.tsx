import { BorderRadius, Spacing } from "@constants/theme";
import { useTheme } from "@hooks/useTheme";
import React, { useState } from "react";
import {
	LayoutAnimation,
	Platform,
	StyleSheet,
	UIManager,
	View,
} from "react-native";
import {
	MonthCardContext,
	type MonthCardContextValue,
	type MonthCardProps,
	type Projection,
} from "./MonthCardContext";

if (
	Platform.OS === "android" &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function MonthCardRoot({
	monthData,
	children,
}: Readonly<MonthCardProps>) {
	const { theme } = useTheme();
	const [expanded, setExpanded] = useState(false);
	const [selectedDay, setSelectedDay] = useState<Projection | null>(null);

	const projectionMap = React.useMemo(() => {
		const map = new Map<number, Projection>();
		monthData.projections.forEach((p) => {
			const day = new Date(p.date).getUTCDate();
			map.set(day, p);
		});
		return map;
	}, [monthData.projections]);

	const toggleExpand = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setExpanded((prev) => !prev);
	};

	const contextValue: MonthCardContextValue = React.useMemo(
		() => ({
			monthData,
			theme,
			expanded,
			toggleExpand,
			selectedDay,
			setSelectedDay,
			projectionMap,
		}),
		[monthData, theme, expanded, selectedDay, projectionMap],
	);

	return (
		<MonthCardContext.Provider value={contextValue}>
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
	},
});
