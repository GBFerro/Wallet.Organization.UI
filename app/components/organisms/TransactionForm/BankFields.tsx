import { CARD_LABELS } from "@constants/api";
import { TEXT } from "@constants/text";
import { FormSection } from "./FormSection";
import { FormTextInput } from "./FormTextInput";
import { OptionChips } from "./OptionChips";
import { CARD_OPTIONS, requiresBank } from "./rules";
import { useTransactionFormContext } from "./TransactionFormContext";

export function BankFields() {
	const { draft, update } = useTransactionFormContext();

	if (!requiresBank(draft.method)) return null;

	const cardOptions = CARD_OPTIONS.map((card) => ({
		value: card,
		label: CARD_LABELS[card],
	}));

	return (
		<>
			<FormSection label={TEXT.form.bank}>
				<FormTextInput
					placeholder={TEXT.form.bankPlaceholder}
					value={draft.bankName}
					onChangeText={(bankName) => update({ bankName })}
				/>
			</FormSection>

			<FormSection label={TEXT.form.card}>
				<OptionChips
					layout="scroll"
					options={cardOptions}
					selected={draft.card}
					onSelect={(card) => update({ card })}
				/>
			</FormSection>
		</>
	);
}
