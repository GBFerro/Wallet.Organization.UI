import { TEXT } from "@constants/text";
import { FormSection } from "./FormSection";
import { FormTextInput } from "./FormTextInput";
import { useTransactionFormContext } from "./TransactionFormContext";

export function DescriptionField() {
	const { draft, update } = useTransactionFormContext();

	return (
		<FormSection label={TEXT.form.description}>
			<FormTextInput
				placeholder={TEXT.form.descriptionPlaceholder}
				value={draft.description}
				onChangeText={(description) => update({ description })}
			/>
		</FormSection>
	);
}
