import { BorderRadius, Spacing } from "@constants/theme";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import { cn } from "@utils/cn";
import React from "react";
import type { TextInputProps, ViewProps } from "react-native";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

export interface SearchBarProps extends ViewProps {
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	inputProps?: Omit<TextInputProps, "value" | "onChangeText" | "placeholder">;
	className?: string;
}

export function SearchBar({
	value,
	onChangeText,
	placeholder = "Buscar...",
	inputProps,
	className,
	style,
	...props
}: Readonly<SearchBarProps>) {
	const { theme } = useTheme();

	return (
		<View
			{...props}
			className={cn(className)}
			style={[
				styles.searchBar,
				{ backgroundColor: theme.backgroundDefault },
				style,
			]}
		>
			<Feather name="search" size={20} color={theme.textSecondary} />
			<TextInput
				{...inputProps}
				style={[styles.searchInput, { color: theme.text }]}
				placeholder={placeholder}
				placeholderTextColor={theme.textSecondary}
				value={value}
				onChangeText={onChangeText}
			/>
			{value.length > 0 && (
				<Pressable onPress={() => onChangeText("")}>
					<Feather name="x" size={20} color={theme.textSecondary} />
				</Pressable>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	searchBar: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.md,
		borderRadius: BorderRadius.sm,
		gap: Spacing.sm,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		padding: 0,
	},
});
