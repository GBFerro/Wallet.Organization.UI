import { ThemedText } from "@components/atoms/ThemedText";
import { ThemedView } from "@components/atoms/ThemedView";
import {
	CardEnum,
	PAYMENT_METHOD_LABELS,
	PaymentMethodEnum,
	RECURRENCE_LABELS,
	RecurrenceEnum,
	TRANSACTION_TYPE_LABELS,
	Transaction,
	TransactionEnum,
} from "@constants/api";
import { BorderRadius, Spacing } from "@constants/theme";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import React, { useState } from "react";
import {
	Pressable,
	ScrollView,
	StyleSheet,
	TextInput,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface TransactionFormProps {
	transaction: Transaction | null;
	onSave: (transaction: Transaction) => void;
	onCancel: () => void;
}

export function TransactionForm({
	transaction,
	onSave,
	onCancel,
}: Readonly<TransactionFormProps>) {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();

	const [type, setType] = useState<TransactionEnum>(
		transaction?.type || TransactionEnum.Expense,
	);
	const [description, setDescription] = useState(
		transaction?.description || "",
	);
	const [amount, setAmount] = useState(
		transaction?.payment.amount.toString() || "",
	);
	const [method, setMethod] = useState<PaymentMethodEnum>(
		transaction?.payment.method || PaymentMethodEnum.Pix,
	);
	const [frequency, setFrequency] = useState<RecurrenceEnum>(
		transaction?.payment.frequency || RecurrenceEnum.OneTime,
	);

	const isValid = amount.length > 0 && Number.parseFloat(amount) > 0;

	const handleSave = () => {
		if (!isValid) return;

		const newTransaction: Transaction = {
			id: transaction?.id || `trans-${Date.now()}`,
			description: description || undefined,
			date: transaction?.date || new Date().toISOString().split("T")[0],
			type,
			payment: {
				id: transaction?.payment.id || `pay-${Date.now()}`,
				amount: Number.parseFloat(amount),
				currency: "BRL",
				frequency,
				method,
				bankInfo: {
					id: transaction?.payment.bankInfo?.id || `bank-${Date.now()}`,
					name: "Banco Principal",
					card: CardEnum.Physical,
				},
			},
		};

		onSave(newTransaction);
	};

	const typeOptions = [
		TransactionEnum.Income,
		TransactionEnum.Expense,
		TransactionEnum.Investment,
	];

	const methodOptions = [
		PaymentMethodEnum.Pix,
		PaymentMethodEnum.CreditCard,
		PaymentMethodEnum.DebitCard,
		PaymentMethodEnum.Cash,
	];

	const frequencyOptions = [
		RecurrenceEnum.OneTime,
		RecurrenceEnum.Daily,
		RecurrenceEnum.Weekly,
		RecurrenceEnum.Monthly,
		RecurrenceEnum.Yearly,
	];

	const getSaveButtonOpacity = (pressed: boolean) => {
		if (pressed) return 0.6;
		return isValid ? 1 : 0.4;
	};

	const getPaymentMethodIcon = (
		paymentMethod: PaymentMethodEnum,
	): keyof typeof Feather.glyphMap => {
		if (
			paymentMethod === PaymentMethodEnum.CreditCard ||
			paymentMethod === PaymentMethodEnum.DebitCard
		) {
			return "credit-card";
		}
		if (paymentMethod === PaymentMethodEnum.Pix) {
			return "smartphone";
		}
		return "dollar-sign";
	};

	return (
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
					onPress={onCancel}
					style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
				>
					<ThemedText type="body" style={{ color: theme.link }}>
						Cancelar
					</ThemedText>
				</Pressable>
				<ThemedText type="label">
					{transaction ? "Editar" : "Nova"} Transacao
				</ThemedText>
				<Pressable
					onPress={handleSave}
					disabled={!isValid}
					style={({ pressed }) => [{ opacity: getSaveButtonOpacity(pressed) }]}
				>
					<ThemedText
						type="body"
						style={{
							color: isValid ? theme.link : theme.textSecondary,
							fontWeight: "600",
						}}
					>
						Salvar
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
				<View style={styles.section}>
					<ThemedText
						type="caption"
						style={[styles.label, { color: theme.textSecondary }]}
					>
						TIPO
					</ThemedText>
					<View style={styles.optionsRow}>
						{typeOptions.map((t) => (
							<Pressable
								key={t}
								style={[
									styles.optionButton,
									{
										backgroundColor:
											type === t ? theme.primary : theme.backgroundDefault,
										borderColor: type === t ? theme.primary : theme.border,
									},
								]}
								onPress={() => setType(t)}
							>
								<ThemedText
									type="caption"
									style={{
										color: type === t ? "#FFFFFF" : theme.text,
									}}
								>
									{TRANSACTION_TYPE_LABELS[t]}
								</ThemedText>
							</Pressable>
						))}
					</View>
				</View>

				<View style={styles.section}>
					<ThemedText
						type="caption"
						style={[styles.label, { color: theme.textSecondary }]}
					>
						DESCRICAO
					</ThemedText>
					<TextInput
						style={[
							styles.input,
							{
								backgroundColor: theme.backgroundDefault,
								color: theme.text,
								borderColor: theme.border,
							},
						]}
						placeholder="Ex: Salario, Aluguel..."
						placeholderTextColor={theme.textSecondary}
						value={description}
						onChangeText={setDescription}
					/>
				</View>

				<View style={styles.section}>
					<ThemedText
						type="caption"
						style={[styles.label, { color: theme.textSecondary }]}
					>
						VALOR (R$)
					</ThemedText>
					<TextInput
						style={[
							styles.input,
							styles.amountInput,
							{
								backgroundColor: theme.backgroundDefault,
								color: theme.text,
								borderColor: theme.border,
							},
						]}
						placeholder="0,00"
						placeholderTextColor={theme.textSecondary}
						value={amount}
						onChangeText={(text) => setAmount(text.replaceAll(/[^0-9.,]/g, ""))}
						keyboardType="decimal-pad"
					/>
				</View>

				<View style={styles.section}>
					<ThemedText
						type="caption"
						style={[styles.label, { color: theme.textSecondary }]}
					>
						METODO DE PAGAMENTO
					</ThemedText>
					<View style={styles.optionsGrid}>
						{methodOptions.map((m) => (
							<Pressable
								key={m}
								style={[
									styles.gridOption,
									{
										backgroundColor:
											method === m ? theme.primary : theme.backgroundDefault,
										borderColor: method === m ? theme.primary : theme.border,
									},
								]}
								onPress={() => setMethod(m)}
							>
								<Feather
									name={getPaymentMethodIcon(m)}
									size={20}
									color={method === m ? "#FFFFFF" : theme.text}
								/>
								<ThemedText
									type="caption"
									style={{
										color: method === m ? "#FFFFFF" : theme.text,
									}}
								>
									{PAYMENT_METHOD_LABELS[m]}
								</ThemedText>
							</Pressable>
						))}
					</View>
				</View>

				<View style={styles.section}>
					<ThemedText
						type="caption"
						style={[styles.label, { color: theme.textSecondary }]}
					>
						FREQUENCIA
					</ThemedText>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.optionsRow}
					>
						{frequencyOptions.map((f) => (
							<Pressable
								key={f}
								style={[
									styles.optionButton,
									{
										backgroundColor:
											frequency === f ? theme.primary : theme.backgroundDefault,
										borderColor: frequency === f ? theme.primary : theme.border,
									},
								]}
								onPress={() => setFrequency(f)}
							>
								<ThemedText
									type="caption"
									style={{
										color: frequency === f ? "#FFFFFF" : theme.text,
									}}
								>
									{RECURRENCE_LABELS[f]}
								</ThemedText>
							</Pressable>
						))}
					</ScrollView>
				</View>
			</ScrollView>
		</ThemedView>
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
	section: {
		marginBottom: Spacing.xl,
	},
	label: {
		marginBottom: Spacing.sm,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	input: {
		borderWidth: 1,
		borderRadius: BorderRadius.sm,
		padding: Spacing.lg,
		fontSize: 16,
	},
	amountInput: {
		fontSize: 24,
		fontWeight: "600",
	},
	optionsRow: {
		flexDirection: "row",
		gap: Spacing.sm,
	},
	optionButton: {
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.md,
		borderRadius: BorderRadius.sm,
		borderWidth: 1,
	},
	optionsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: Spacing.sm,
	},
	gridOption: {
		width: "48%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: Spacing.sm,
		paddingVertical: Spacing.lg,
		borderRadius: BorderRadius.sm,
		borderWidth: 1,
	},
});
