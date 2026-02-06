import { Spacing } from "@constants/theme";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import { cn } from "@utils/cn";
import React from "react";
import type { PressableProps } from "react-native";
import { Pressable, StyleSheet } from "react-native";

export interface FABProps extends PressableProps {
	icon?: keyof typeof Feather.glyphMap;
	iconSize?: number;
	bottom?: number;
	right?: number;
	className?: string;
}

export function FAB({
	icon = "plus",
	iconSize = 24,
	bottom = Spacing.xl,
	right = Spacing.xl,
	className,
	style,
	...props
}: Readonly<FABProps>) {
	const { theme } = useTheme();

	return (
		<Pressable
			{...props}
			className={cn(className)}
			style={({ pressed }) => [
				styles.fab,
				{
					backgroundColor: theme.primary,
					bottom,
					right,
					opacity: pressed ? 0.8 : 1,
					transform: [{ scale: pressed ? 0.95 : 1 }],
				},
				typeof style === "function"
					? style({
							pressed,
							hovered: false,
						})
					: style,
			]}
		>
			<Feather name={icon} size={iconSize} color={theme.buttonText} />
		</Pressable>
	);
}

const styles = StyleSheet.create({
	fab: {
		position: "absolute",
		width: Spacing.fabSize,
		height: Spacing.fabSize,
		borderRadius: Spacing.fabSize / 2,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 4,
	},
});
