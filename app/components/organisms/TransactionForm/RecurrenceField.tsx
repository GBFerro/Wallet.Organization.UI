import { RECURRENCE_LABELS } from "@constants/api";
import { TEXT } from "@constants/text";
import { FormSection } from "./FormSection";
import { OptionChips } from "./OptionChips";
import { changeFrequency, FREQUENCY_OPTIONS } from "./rules";
import { useTransactionFormContext } from "./TransactionFormContext";

export function RecurrenceField() {
	const { draft, apply } = useTransactionFormContext();

	const options = FREQUENCY_OPTIONS.map((frequency) => ({
		value: frequency,
		label: RECURRENCE_LABELS[frequency],
	}));

	return (
		<FormSection label={TEXT.form.frequency}>
			<OptionChips
				layout="scroll"
				options={options}
				selected={draft.frequency}
				onSelect={(frequency) => apply((d) => changeFrequency(d, frequency))}
			/>
		</FormSection>
	);
}
