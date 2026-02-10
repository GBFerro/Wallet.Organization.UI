import { BorderRadius, Spacing } from "@constants/theme";
import { useTheme } from "@hooks/useTheme";
import { getSplitedDate } from "@utils/format";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { EASE_IN_OUT, useMonthCardContext } from "./MonthCardContext";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

export function MonthCardCalendar() {
	const { projections, year, monthIndex, expanded, setSelectedDay } =
		useMonthCardContext();
	const { theme } = useTheme();

	const [showContent, setShowContent] = useState(false);
	const animProgress = useSharedValue(0);

	useEffect(() => {
		if (expanded) {
			setShowContent(true);
			animProgress.value = withTiming(1, {
				duration: 350,
				easing: EASE_IN_OUT,
			});
		} else {
			animProgress.value = withTiming(
				0,
				{ duration: 300, easing: EASE_IN_OUT },
				(finished) => {
					if (finished) {
						setShowContent(false);
					}
				},
			);
		}
	}, [expanded, animProgress]);

	const contentStyle = useAnimatedStyle(() => ({
		opacity: animProgress.value,
		maxHeight: interpolate(animProgress.value, [0, 1], [0, 600]),
		overflow: "hidden" as const,
	}));

	if (!showContent) return null;

	const firstDate = new Date(year, monthIndex, 1);
	const lastDate = new Date(year, monthIndex + 1, 0);
	const daysInMonth = lastDate.getDate();
	const startDayOfWeek = firstDate.getDay();

	const weeks: (number | null)[][] = [];
	let currentWeek: (number | null)[] = [];

	for (let i = 0; i < startDayOfWeek; i++) currentWeek.push(null);
	for (let day = 1; day <= daysInMonth; day++) {
		currentWeek.push(day);
		if (currentWeek.length === 7) {
			weeks.push(currentWeek);
			currentWeek = [];
		}
	}
	if (currentWeek.length > 0) {
		while (currentWeek.length < 7) currentWeek.push(null);
		weeks.push(currentWeek);
	}
	getSplitedDate();
	const today = getSplitedDate();
	const todayDay = today.day;
	const todayMonth = today.month;
	const todayYear = today.year;

	return (
		<Animated.View style={contentStyle}>
			<View style={styles.calendarContainer}>
				<View style={styles.weekdaysRow}>
					{WEEKDAYS.map((day, index) => (
						<View key={day} style={styles.weekdayCell}>
							<Text
								style={{
									color:
										index === 0 || index === 6
											? theme.expense
											: theme.textSecondary,
									fontWeight: "600" as const,
									fontSize: 11,
								}}
							>
								{day}
							</Text>
						</View>
					))}
				</View>

				{weeks.map((week, weekIndex) => (
					<View key={`week-${week}-${weekIndex}`} style={styles.weekRow}>
						{week.map((day, dayIndex) => {
							if (day === null) {
								return (
									<View
										key={`empty-${weekIndex}-${dayIndex}`}
										style={styles.dayCell}
									/>
								);
							}

							const projection = projections.find((p) => {
								const d = new Date(p.date);
								return d.getUTCDate() === day;
							});
							const hasData = projection !== undefined;
							const isToday =
								day === todayDay &&
								todayMonth === monthIndex + 1 &&
								todayYear === year;
							const isPositive = projection
								? projection.income >= projection.totalExpenses
								: true;
							const isWeekend = dayIndex === 0 || dayIndex === 6;

							return (
								<Pressable
									key={day}
									onPress={() => {
										if (projection) setSelectedDay(projection);
									}}
									style={({ pressed }) => [
										styles.dayCell,
										hasData && {
											backgroundColor: isPositive
												? theme.income + "15"
												: theme.expense + "15",
										},
										isToday && {
											backgroundColor: isPositive
												? theme.income + "40"
												: theme.expense + "40",
										},
										pressed && hasData && { opacity: 0.6 },
									]}
								>
									<Text
										style={{
											fontWeight: "600" as const,
											color: isWeekend ? theme.textSecondary : theme.text,
											fontSize: 12,
										}}
									>
										{day}
									</Text>
									{hasData && projection && (
										<>
											{projection.income > 0 && (
												<Text
													style={{
														fontSize: 9,
														color: theme.income,
														fontWeight: "500" as const,
													}}
												>
													+{projection.income}
												</Text>
											)}
											{projection.totalExpenses > 0 && (
												<Text
													style={{
														fontSize: 9,
														color: theme.expense,
														fontWeight: "500" as const,
													}}
												>
													-{projection.totalExpenses}
												</Text>
											)}
										</>
									)}
								</Pressable>
							);
						})}
					</View>
				))}
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	calendarContainer: {
		paddingHorizontal: Spacing.sm,
		paddingBottom: Spacing.lg,
		borderTopWidth: 1,
		borderTopColor: "rgba(128, 128, 128, 0.2)",
		paddingTop: Spacing.sm,
	},
	weekdaysRow: {
		flexDirection: "row",
		marginBottom: Spacing.xs,
	},
	weekdayCell: {
		flex: 1,
		alignItems: "center",
		paddingVertical: Spacing.xs,
	},
	weekRow: {
		flexDirection: "row",
		marginBottom: 2,
	},
	dayCell: {
		flex: 1,
		aspectRatio: 1,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: BorderRadius.xs,
		margin: 1,
		padding: 2,
	},
});
