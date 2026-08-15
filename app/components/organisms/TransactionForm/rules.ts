import {
	CARD_PAYMENT_METHODS,
	CardEnum,
	PaymentMethodEnum,
	RecurrenceEnum,
	type Transaction,
	TransactionEnum,
	type TransactionPayload,
} from "@constants/api";
import { TEXT } from "@constants/text";
import { parseAmount, parseCivilDate, toCivilDate } from "@utils/format";

export const MINIMUM_INSTALLMENT = 2;

export interface TransactionDraft {
	type: TransactionEnum;
	description: string;
	amount: string;
	date: Date;
	method: PaymentMethodEnum;
	frequency: RecurrenceEnum;
	installment: string;
	bankName: string;
	card: CardEnum;
}

export const TYPE_OPTIONS = [
	TransactionEnum.Income,
	TransactionEnum.Expense,
	TransactionEnum.Investment,
];

export const FREQUENCY_OPTIONS = [
	RecurrenceEnum.OneTime,
	RecurrenceEnum.Daily,
	RecurrenceEnum.Weekly,
	RecurrenceEnum.Monthly,
	RecurrenceEnum.Yearly,
];

export const CARD_OPTIONS = [
	CardEnum.Physical,
	CardEnum.Virtual,
	CardEnum.Prepaid,
	CardEnum.NonStop,
	CardEnum.Ticket,
];

const ALL_METHODS = [
	PaymentMethodEnum.Pix,
	PaymentMethodEnum.CreditCard,
	PaymentMethodEnum.DebitCard,
	PaymentMethodEnum.Cash,
];

const DEFAULT_METHOD = PaymentMethodEnum.Pix;

export function methodOptionsFor(type: TransactionEnum): PaymentMethodEnum[] {
	if (type === TransactionEnum.Income) {
		return ALL_METHODS.filter((m) => m !== PaymentMethodEnum.CreditCard);
	}
	return ALL_METHODS;
}

export function requiresBank(method: PaymentMethodEnum): boolean {
	return CARD_PAYMENT_METHODS.includes(method);
}

export function allowsInstallment(
	method: PaymentMethodEnum,
	frequency: RecurrenceEnum,
): boolean {
	return (
		method === PaymentMethodEnum.CreditCard &&
		frequency === RecurrenceEnum.Monthly
	);
}

function clearBank(draft: TransactionDraft): TransactionDraft {
	if (requiresBank(draft.method)) return draft;
	return { ...draft, bankName: "", card: CardEnum.Physical };
}

function clearInstallment(draft: TransactionDraft): TransactionDraft {
	if (allowsInstallment(draft.method, draft.frequency)) return draft;
	return { ...draft, installment: "" };
}

export function changeMethod(
	draft: TransactionDraft,
	method: PaymentMethodEnum,
): TransactionDraft {
	let next: TransactionDraft = { ...draft, method };

	if (
		method === PaymentMethodEnum.CreditCard &&
		next.frequency !== RecurrenceEnum.Monthly
	) {
		next = { ...next, frequency: RecurrenceEnum.Monthly };
	}

	return clearInstallment(clearBank(next));
}

export function changeFrequency(
	draft: TransactionDraft,
	frequency: RecurrenceEnum,
): TransactionDraft {
	return clearInstallment({ ...draft, frequency });
}

export function changeType(
	draft: TransactionDraft,
	type: TransactionEnum,
): TransactionDraft {
	const next: TransactionDraft = { ...draft, type };
	if (methodOptionsFor(type).includes(next.method)) return next;
	return changeMethod(next, DEFAULT_METHOD);
}

export function validate(draft: TransactionDraft): string {
	if (!draft.description.trim()) return TEXT.form.errorDescriptionRequired;

	const amount = parseAmount(draft.amount);
	if (!Number.isFinite(amount) || amount <= 0) {
		return TEXT.form.errorAmountRequired;
	}

	if (requiresBank(draft.method) && !draft.bankName.trim()) {
		return TEXT.form.errorBankRequired;
	}

	if (
		allowsInstallment(draft.method, draft.frequency) &&
		draft.installment &&
		Number.parseInt(draft.installment, 10) < MINIMUM_INSTALLMENT
	) {
		return TEXT.form.errorInstallmentInvalid;
	}

	return "";
}

export function isSubmittable(draft: TransactionDraft): boolean {
	const amount = parseAmount(draft.amount);
	return Number.isFinite(amount) && amount > 0;
}

export function emptyDraft(): TransactionDraft {
	return {
		type: TransactionEnum.Expense,
		description: "",
		amount: "",
		date: new Date(),
		method: DEFAULT_METHOD,
		frequency: RecurrenceEnum.OneTime,
		installment: "",
		bankName: "",
		card: CardEnum.Physical,
	};
}

export function draftFrom(transaction: Transaction | null): TransactionDraft {
	if (!transaction) return emptyDraft();

	return {
		type: transaction.type,
		description: transaction.description || "",
		amount: String(transaction.payment.amount),
		date: parseCivilDate(transaction.date),
		method: transaction.payment.method,
		frequency: transaction.payment.frequency || RecurrenceEnum.OneTime,
		installment: transaction.payment.installment
			? String(transaction.payment.installment)
			: "",
		bankName: transaction.payment.bankInfo?.name || "",
		card: transaction.payment.bankInfo?.card || CardEnum.Physical,
	};
}

export function toPayload(draft: TransactionDraft): TransactionPayload {
	const installment =
		allowsInstallment(draft.method, draft.frequency) && draft.installment
			? Number.parseInt(draft.installment, 10)
			: undefined;

	return {
		description: draft.description.trim(),
		date: toCivilDate(draft.date),
		type: draft.type,
		payment: {
			amount: parseAmount(draft.amount),
			currency: "BRL",
			frequency: draft.frequency,
			installment,
			method: draft.method,
			bankInfo: requiresBank(draft.method)
				? { name: draft.bankName.trim(), card: draft.card }
				: undefined,
		},
	};
}
