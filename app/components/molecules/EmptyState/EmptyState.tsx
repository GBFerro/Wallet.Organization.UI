import { Button } from "@components/atoms/Button";
import { ThemedText } from "@components/atoms/ThemedText";
import { BorderRadius, Spacing } from "@constants/theme";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import { cn } from "@utils/cn";
import React from "react";
import type { ViewProps } from "react-native";
import { StyleSheet, View } from "react-native";

export interface EmptyStateProps extends ViewProps {
	icon?: keyof typeof Feather.glyphMap;
	iconSize?: number;
	title?: string;
	message: string;
	actionLabel?: string;
	onAction?: () => void;
	variant?: "empty" | "error";
	className?: string;
}

export function EmptyState({
	icon,
	iconSize = 48,
	title,
	message,
	actionLabel,
	onAction,
	variant = "empty",
	className,
	style,
	...props
}: Readonly<EmptyStateProps>) {
	const { theme } = useTheme();

	const defaultIcon = variant === "error" ? "alert-circle" : "inbox";
	const iconColor = variant === "error" ? theme.expense : theme.textSecondary;

	return (
		<View
			{...props}
			className={cn(className)}
			style={[styles.container, style]}
		>
			<Feather name={icon || defaultIcon} size={iconSize} color={iconColor} />

			{title && (
				<ThemedText type="label" style={{ textAlign: "center" }}>
					{title}
				</ThemedText>
			)}

			<ThemedText
				type="body"
				style={[styles.message, { color: theme.textSecondary }]}
			>
				{message}
			</ThemedText>

			{actionLabel && onAction && (
				<Button
					onPress={onAction}
					className="mt-4"
					style={[styles.button, { backgroundColor: theme.primary }]}
				>
					<ThemedText type="body" style={{ color: theme.buttonText }}>
						{actionLabel}
					</ThemedText>
				</Button>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: Spacing["5xl"],
		gap: Spacing.lg,
	},
	message: {
		textAlign: "center",
	},
	button: {
		paddingHorizontal: Spacing.xl,
		paddingVertical: Spacing.md,
		borderRadius: BorderRadius.sm,
	},
});
