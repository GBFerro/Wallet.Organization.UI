import { TEXT } from "@constants/text";
import { FormSection } from "./FormSection";
import { FormTextInput } from "./FormTextInput";
import { allowsInstallment } from "./rules";
import { useTransactionFormContext } from "./TransactionFormContext";

export function InstallmentField() {
	const { draft, update } = useTransactionFormContext();

	if (!allowsInstallment(draft.method, draft.frequency)) return null;

	return (
		<FormSection label={TEXT.form.installment} hint={TEXT.form.installmentHint}>
			<FormTextInput
				placeholder={TEXT.form.installmentPlaceholder}
				value={draft.installment}
				onChangeText={(text) =>
					update({ installment: text.replaceAll(/[^0-9]/g, "") })
				}
				keyboardType="number-pad"
			/>
		</FormSection>
	);
}
