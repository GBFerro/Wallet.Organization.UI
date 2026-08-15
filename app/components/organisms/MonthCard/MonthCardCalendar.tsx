import { Projection } from "@constants/api";
import { BorderRadius, Spacing } from "@constants/theme";
import { useTheme } from "@hooks/useTheme";
import { getSplitedDate, parseCivilDate } from "@utils/format";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { EASE_IN_OUT, useMonthCardContext } from "./MonthCardContext";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const CELL_GAP = 1;

export function MonthCardCalendar() {
	const { projections, year, monthIndex, expanded, setSelectedDay } =
		useMonthCardContext();
	const { theme } = useTheme();

	const [showContent, setShowContent] = useState(false);
	const [contentHeight, setContentHeight] = useState(0);
	const [gridWidth, setGridWidth] = useState(0);
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
					"worklet";
					if (finished) {
						scheduleOnRN(setShowContent, false);
					}
				},
			);
		}
	}, [expanded, animProgress]);

	const contentStyle = useAnimatedStyle(() => ({
		opacity: animProgress.value,
		height:
			contentHeight > 0
				? interpolate(animProgress.value, [0, 1], [0, contentHeight])
				: undefined,
		overflow: "hidden" as const,
	}));

	if (!showContent) return null;

	const projectionByDay = new Map<number, Projection>();
	projections.forEach((p) => {
		projectionByDay.set(parseCivilDate(p.date).getDate(), p);
	});

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
	const today = getSplitedDate();
	const todayDay = today.day;
	const todayMonth = today.month;
	const todayYear = today.year;

	const cellSize =
		gridWidth > 0
			? { width: Math.floor(gridWidth / 7) - CELL_GAP * 2 }
			: undefined;

	return (
		<Animated.View style={contentStyle}>
			<View
				style={styles.calendarContainer}
				onLayout={(event) => setContentHeight(event.nativeEvent.layout.height)}
			>
				<View
					style={styles.weekdaysRow}
					onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
				>
					{WEEKDAYS.map((day, index) => (
						<View key={day} style={[styles.weekdayCell, cellSize]}>
							<Text
								numberOfLines={1}
								maxFontSizeMultiplier={1.2}
								style={[
									styles.weekdayLabel,
									{
										color:
											index === 0 || index === 6
												? theme.expense
												: theme.textSecondary,
									},
								]}
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
										style={[styles.dayCell, cellSize]}
									/>
								);
							}

							const projection = projectionByDay.get(day);
							const hasMovement =
								projection !== undefined &&
								(projection.income > 0 || projection.totalExpenses > 0);
							const isToday =
								day === todayDay &&
								todayMonth === monthIndex + 1 &&
								todayYear === year;
							const isPositive = projection ? projection.netChange >= 0 : true;
							const isWeekend = dayIndex === 0 || dayIndex === 6;

							return (
								<Pressable
									key={day}
									onPress={() => {
										if (projection) setSelectedDay(projection);
									}}
									style={[
										styles.dayCell,
										cellSize,
										hasMovement && {
											backgroundColor: isPositive
												? theme.income + "15"
												: theme.expense + "15",
										},
										isToday && {
											backgroundColor: isPositive
												? theme.income + "40"
												: theme.expense + "40",
										},
									]}
								>
									{({ pressed }) => (
										<View
											style={[
												styles.dayCellContent,
												pressed && hasMovement && styles.dayCellPressed,
											]}
										>
											<Text
												numberOfLines={1}
												maxFontSizeMultiplier={1.2}
												style={[
													styles.dayNumber,
													{
														color: isWeekend ? theme.textSecondary : theme.text,
													},
												]}
											>
												{day}
											</Text>
											{hasMovement && projection && (
												<>
													{projection.income > 0 && (
														<Text
															numberOfLines={1}
															adjustsFontSizeToFit
															minimumFontScale={0.8}
															maxFontSizeMultiplier={1.1}
															style={[styles.dayValue, { color: theme.income }]}
														>
															+{projection.income}
														</Text>
													)}
													{projection.totalExpenses > 0 && (
														<Text
															numberOfLines={1}
															adjustsFontSizeToFit
															minimumFontScale={0.8}
															maxFontSizeMultiplier={1.1}
															style={[
																styles.dayValue,
																{ color: theme.expense },
															]}
														>
															-{projection.totalExpenses}
														</Text>
													)}
												</>
											)}
										</View>
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
		flexShrink: 0,
		alignItems: "center",
		marginHorizontal: CELL_GAP,
		paddingVertical: Spacing.xs,
	},
	weekdayLabel: {
		fontWeight: "600",
		fontSize: 11,
	},
	weekRow: {
		flexDirection: "row",
		marginBottom: 2,
	},
	dayCell: {
		flexShrink: 0,
		height: 46,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: BorderRadius.xs,
		marginHorizontal: CELL_GAP,
		paddingVertical: 2,
		overflow: "hidden",
	},
	dayCellContent: {
		width: "100%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	dayCellPressed: {
		opacity: 0.6,
	},
	dayNumber: {
		fontWeight: "600",
		fontSize: 12,
	},
	dayValue: {
		width: "100%",
		textAlign: "center",
		fontSize: 9,
		fontWeight: "500",
	},
});
