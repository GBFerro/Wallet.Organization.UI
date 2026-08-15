import { TEXT } from "@constants/text";
import { FormSection } from "./FormSection";
import { FormTextInput } from "./FormTextInput";
import { useTransactionFormContext } from "./TransactionFormContext";

export function AmountField() {
	const { draft, update } = useTransactionFormContext();

	return (
		<FormSection label={TEXT.form.amount}>
			<FormTextInput
				emphasis
				placeholder={TEXT.form.amountPlaceholder}
				value={draft.amount}
				onChangeText={(text) =>
					update({ amount: text.replaceAll(/[^0-9.,]/g, "") })
				}
				keyboardType="decimal-pad"
			/>
		</FormSection>
	);
}
