import {
	CARD_PAYMENT_METHODS,
	PAYMENT_METHOD_LABELS,
	PaymentMethodEnum,
} from "@constants/api";
import { TEXT } from "@constants/text";
import type { Feather } from "@expo/vector-icons";
import { FormSection } from "./FormSection";
import { OptionChips } from "./OptionChips";
import { changeMethod, methodOptionsFor } from "./rules";
import { useTransactionFormContext } from "./TransactionFormContext";

function iconFor(method: PaymentMethodEnum): keyof typeof Feather.glyphMap {
	if (CARD_PAYMENT_METHODS.includes(method)) return "credit-card";
	if (method === PaymentMethodEnum.Pix) return "smartphone";
	return "dollar-sign";
}

export function PaymentMethodField() {
	const { draft, apply } = useTransactionFormContext();

	const options = methodOptionsFor(draft.type).map((method) => ({
		value: method,
		label: PAYMENT_METHOD_LABELS[method],
		icon: iconFor(method),
	}));

	return (
		<FormSection label={TEXT.form.method}>
			<OptionChips
				layout="grid"
				options={options}
				selected={draft.method}
				onSelect={(method) => apply((d) => changeMethod(d, method))}
			/>
		</FormSection>
	);
}
