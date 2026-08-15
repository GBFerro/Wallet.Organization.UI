import { ThemedText } from "@components/atoms/ThemedText";
import { Spacing } from "@constants/theme";
import { useTheme } from "@hooks/useTheme";
import type React from "react";
import { StyleSheet, View } from "react-native";

export interface FormSectionProps {
	label: string;
	hint?: string;
	children: React.ReactNode;
}

export function FormSection({
	label,
	hint,
	children,
}: Readonly<FormSectionProps>) {
	const { theme } = useTheme();

	return (
		<View style={styles.section}>
			<ThemedText
				type="caption"
				style={[styles.label, { color: theme.textSecondary }]}
			>
				{label}
			</ThemedText>
			{children}
			{hint ? (
				<ThemedText
					type="caption"
					style={[styles.hint, { color: theme.textSecondary }]}
				>
					{hint}
				</ThemedText>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		marginBottom: Spacing.xl,
	},
	label: {
		marginBottom: Spacing.sm,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	hint: {
		marginTop: Spacing.xs,
	},
});
