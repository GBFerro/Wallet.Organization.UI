import { BorderRadius, Spacing } from "@constants/theme";
import { useTheme } from "@hooks/useTheme";
import { StyleSheet, TextInput, type TextInputProps } from "react-native";

export interface FormTextInputProps extends TextInputProps {
	emphasis?: boolean;
}

export function FormTextInput({
	emphasis = false,
	style,
	...rest
}: Readonly<FormTextInputProps>) {
	const { theme } = useTheme();

	return (
		<TextInput
			{...rest}
			placeholderTextColor={theme.textSecondary}
			style={[
				styles.input,
				emphasis && styles.emphasis,
				{
					backgroundColor: theme.backgroundDefault,
					color: theme.text,
					borderColor: theme.border,
				},
				style,
			]}
		/>
	);
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		borderRadius: BorderRadius.sm,
		padding: Spacing.lg,
		fontSize: 16,
	},
	emphasis: {
		fontSize: 24,
		fontWeight: "600",
	},
});
