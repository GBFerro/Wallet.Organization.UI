import { ThemedText } from "@components/atoms/ThemedText";
import { TEXT } from "@constants/text";
import { BorderRadius, Spacing } from "@constants/theme";
import { Feather } from "@expo/vector-icons";
import { usePressed } from "@hooks/usePressed";
import { useTheme } from "@hooks/useTheme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { FormSection } from "./FormSection";
import { useTransactionFormContext } from "./TransactionFormContext";

const MIN_DATE = new Date(2000, 0, 1);
const MAX_DATE = new Date(2100, 11, 31);

export function DateField() {
	const { theme } = useTheme();
	const { draft, update } = useTransactionFormContext();
	const [isOpen, setIsOpen] = useState(false);
	const { pressed, pressHandlers } = usePressed();

	return (
		<FormSection label={TEXT.form.date}>
			<Pressable
				{...pressHandlers}
				onPress={() => setIsOpen(true)}
				accessibilityRole="button"
				accessibilityLabel={TEXT.form.date}
				style={[
					styles.trigger,
					{
						backgroundColor: theme.backgroundDefault,
						borderColor: theme.border,
						opacity: pressed ? 0.7 : 1,
					},
				]}
			>
				<Feather name="calendar" size={20} color={theme.textSecondary} />
				<ThemedText type="body" style={{ color: theme.text }}>
					{draft.date.toLocaleDateString("pt-BR", {
						day: "2-digit",
						month: "2-digit",
						year: "numeric",
					})}
				</ThemedText>
			</Pressable>

			{isOpen && (
				<DateTimePicker
					value={draft.date}
					mode="date"
					display={Platform.OS === "ios" ? "spinner" : "default"}
					minimumDate={MIN_DATE}
					maximumDate={MAX_DATE}
					onChange={(_event, selectedDate) => {
						if (Platform.OS === "android") setIsOpen(false);
						if (selectedDate) update({ date: selectedDate });
					}}
				/>
			)}

			{Platform.OS === "ios" && isOpen && (
				<View style={styles.doneRow}>
					<Pressable
						onPress={() => setIsOpen(false)}
						accessibilityRole="button"
						accessibilityLabel={TEXT.form.datePickerDone}
						style={[styles.doneButton, { backgroundColor: theme.primary }]}
					>
						<ThemedText type="body" style={{ color: "#FFFFFF" }}>
							{TEXT.form.datePickerDone}
						</ThemedText>
					</Pressable>
				</View>
			)}
		</FormSection>
	);
}

const styles = StyleSheet.create({
	trigger: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.md,
		borderWidth: 1,
		borderRadius: BorderRadius.sm,
		padding: Spacing.lg,
	},
	doneRow: {
		marginTop: Spacing.sm,
	},
	doneButton: {
		alignItems: "center",
		paddingVertical: Spacing.md,
		borderRadius: BorderRadius.sm,
	},
});
