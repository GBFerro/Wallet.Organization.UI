import { ThemedText } from "@components/atoms/ThemedText";
import { ThemedView } from "@components/atoms/ThemedView";
import type { Transaction, TransactionPayload } from "@constants/api";
import { TEXT } from "@constants/text";
import { BorderRadius, Spacing } from "@constants/theme";
import { Feather } from "@expo/vector-icons";
import { usePressed } from "@hooks/usePressed";
import { useTheme } from "@hooks/useTheme";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AmountField } from "./AmountField";
import { BankFields } from "./BankFields";
import { DateField } from "./DateField";
import { DescriptionField } from "./DescriptionField";
import { InstallmentField } from "./InstallmentField";
import { PaymentMethodField } from "./PaymentMethodField";
import { RecurrenceField } from "./RecurrenceField";
import {
	draftFrom,
	isSubmittable,
	type TransactionDraft,
	toPayload,
	validate,
} from "./rules";
import {
	TransactionFormContext,
	type TransactionFormContextValue,
} from "./TransactionFormContext";
import { TypeField } from "./TypeField";

export interface TransactionFormProps {
	transaction: Transaction | null;
	onSave: (payload: TransactionPayload) => void;
	onCancel: () => void;
}

export function TransactionForm({
	transaction,
	onSave,
	onCancel,
}: Readonly<TransactionFormProps>) {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const cancelPress = usePressed();
	const savePress = usePressed();

	const [draft, setDraft] = useState<TransactionDraft>(() =>
		draftFrom(transaction),
	);
	const [error, setError] = useState("");

	const update = useCallback((patch: Partial<TransactionDraft>) => {
		setDraft((current) => ({ ...current, ...patch }));
	}, []);

	const apply = useCallback(
		(transition: (draft: TransactionDraft) => TransactionDraft) => {
			setDraft((current) => transition(current));
		},
		[],
	);

	const contextValue: TransactionFormContextValue = useMemo(
		() => ({ draft, update, apply }),
		[draft, update, apply],
	);

	const canSubmit = isSubmittable(draft);

	const handleSave = () => {
		const validationError = validate(draft);
		if (validationError) {
			setError(validationError);
			return;
		}
		setError("");
		onSave(toPayload(draft));
	};

	const saveOpacity = () => {
		if (savePress.pressed) return 0.6;
		return canSubmit ? 1 : 0.4;
	};

	return (
		<TransactionFormContext.Provider value={contextValue}>
			<ThemedView style={styles.container}>
				<View
					style={[
						styles.header,
						{
							paddingTop: insets.top + Spacing.md,
							borderBottomColor: theme.border,
						},
					]}
				>
					<Pressable
						{...cancelPress.pressHandlers}
						onPress={onCancel}
						accessibilityRole="button"
						accessibilityLabel={TEXT.common.cancel}
						style={{ opacity: cancelPress.pressed ? 0.6 : 1 }}
					>
						<ThemedText type="body" style={{ color: theme.link }}>
							{TEXT.common.cancel}
						</ThemedText>
					</Pressable>

					<ThemedText type="label" numberOfLines={1}>
						{transaction ? TEXT.form.editTitle : TEXT.form.newTitle}
					</ThemedText>

					<Pressable
						{...savePress.pressHandlers}
						onPress={handleSave}
						disabled={!canSubmit}
						accessibilityRole="button"
						accessibilityLabel={TEXT.common.save}
						style={{ opacity: saveOpacity() }}
					>
						<ThemedText
							type="body"
							style={{
								color: canSubmit ? theme.link : theme.textSecondary,
								fontWeight: "600",
							}}
						>
							{TEXT.common.save}
						</ThemedText>
					</Pressable>
				</View>

				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={[
						styles.content,
						{ paddingBottom: insets.bottom + Spacing.xl },
					]}
					keyboardShouldPersistTaps="handled"
				>
					{error ? (
						<View
							style={[
								styles.errorContainer,
								{ backgroundColor: theme.expense + "20" },
							]}
						>
							<Feather name="alert-circle" size={16} color={theme.expense} />
							<ThemedText
								type="caption"
								style={{ color: theme.expense, flex: 1 }}
							>
								{error}
							</ThemedText>
						</View>
					) : null}

					<TypeField />
					<DateField />
					<DescriptionField />
					<AmountField />
					<PaymentMethodField />
					<BankFields />
					<RecurrenceField />
					<InstallmentField />
				</ScrollView>
			</ThemedView>
		</TransactionFormContext.Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gap: Spacing.md,
		paddingHorizontal: Spacing.xl,
		paddingBottom: Spacing.lg,
		borderBottomWidth: 1,
	},
	scrollView: {
		flex: 1,
	},
	content: {
		padding: Spacing.xl,
	},
	errorContainer: {
		flexDirection: "row",
		alignItems: "center",
		padding: Spacing.md,
		borderRadius: BorderRadius.xs,
		gap: Spacing.sm,
		marginBottom: Spacing.xl,
	},
});
