import { TRANSACTION_TYPE_LABELS } from "@constants/api";
import { TEXT } from "@constants/text";
import { FormSection } from "./FormSection";
import { OptionChips } from "./OptionChips";
import { changeType, TYPE_OPTIONS } from "./rules";
import { useTransactionFormContext } from "./TransactionFormContext";

export function TypeField() {
	const { draft, apply } = useTransactionFormContext();

	const options = TYPE_OPTIONS.map((type) => ({
		value: type,
		label: TRANSACTION_TYPE_LABELS[type],
	}));

	return (
		<FormSection label={TEXT.form.type}>
			<OptionChips
				options={options}
				selected={draft.type}
				onSelect={(type) => apply((d) => changeType(d, type))}
			/>
		</FormSection>
	);
}
