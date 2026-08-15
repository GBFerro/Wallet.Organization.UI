import { ThemedText } from "@components/atoms/ThemedText";
import { Effects, Spacing } from "@constants/theme";
import type { Toast as ToastData } from "@contexts/ToastContext";
import { Feather } from "@expo/vector-icons";
import { usePressed } from "@hooks/usePressed";
import { useTheme } from "@hooks/useTheme";
import { cn } from "@utils/cn";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, View, ViewProps } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

export interface ToastProps extends Omit<ViewProps, "style"> {
	toast: ToastData;
	onDismiss: (id: string) => void;
	className?: string;
}

const ICON_MAP = {
	success: "check-circle" as const,
	error: "x-circle" as const,
	warning: "alert-circle" as const,
	info: "info" as const,
};

export function Toast({
	toast,
	onDismiss,
	className,
	...props
}: Readonly<ToastProps>) {
	const { theme } = useTheme();
	const { pressed, pressHandlers } = usePressed();
	const translateY = useSharedValue(-100);
	const opacity = useSharedValue(0);

	const handleDismiss = React.useCallback(() => {
		translateY.value = withTiming(-100, { duration: 200 });
		opacity.value = withTiming(0, { duration: 200 }, (finished) => {
			"worklet";
			if (finished) {
				scheduleOnRN(onDismiss, toast.id);
			}
		});
	}, [translateY, opacity, toast.id, onDismiss]);

	useEffect(() => {
		translateY.value = withSpring(0, {
			damping: 15,
			mass: 0.3,
			stiffness: 150,
		});
		opacity.value = withTiming(1, { duration: 200 });

		if (toast.duration && toast.duration > 0) {
			const timer = setTimeout(() => {
				handleDismiss();
			}, toast.duration);

			return () => clearTimeout(timer);
		}
	}, [translateY, opacity, toast.duration, handleDismiss]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: -translateY.value }],
		opacity: opacity.value,
	}));

	const getBackgroundColor = () => {
		switch (toast.type) {
			case "success":
				return theme.income + "15";
			case "error":
				return theme.expense + "15";
			case "warning":
				return "#F4C430" + "15";
			case "info":
				return theme.primary + "15";
			default:
				return theme.backgroundSecondary;
		}
	};

	const getIconColor = () => {
		switch (toast.type) {
			case "success":
				return theme.income;
			case "error":
				return theme.expense;
			case "warning":
				return "#F4C430";
			case "info":
				return theme.primary;
			default:
				return theme.text;
		}
	};

	const getBorderColor = () => {
		switch (toast.type) {
			case "success":
				return theme.income + "40";
			case "error":
				return theme.expense + "40";
			case "warning":
				return "#F4C430" + "40";
			case "info":
				return theme.primary + "40";
			default:
				return theme.border;
		}
	};

	return (
		<Animated.View
			{...props}
			style={[
				animatedStyle,
				styles.container,
				{
					backgroundColor: getBackgroundColor(),
					borderColor: getBorderColor(),
				},
				Effects.cardShadow,
			]}
			className={cn("mb-2", className)}
		>
			<View style={styles.content}>
				<Feather name={ICON_MAP[toast.type]} size={20} color={getIconColor()} />
				<View style={styles.textContainer}>
					<ThemedText type="body" style={styles.title}>
						{toast.title}
					</ThemedText>
					{toast.description ? (
						<ThemedText type="caption" style={{ color: theme.textSecondary }}>
							{toast.description}
						</ThemedText>
					) : null}
				</View>
				<Pressable
					{...pressHandlers}
					onPress={handleDismiss}
					style={[styles.closeButton, { opacity: pressed ? 0.5 : 1 }]}
				>
					<Feather name="x" size={18} color={theme.textSecondary} />
				</Pressable>
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		paddingVertical: Spacing.md,
		paddingHorizontal: Spacing.lg,
	},
	content: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.sm,
	},
	textContainer: {
		flex: 1,
		gap: 2,
	},
	title: {
		fontWeight: "600",
	},
	closeButton: {
		padding: Spacing.xs,
	},
});
