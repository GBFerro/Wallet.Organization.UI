export type CivilDate = string;

export enum PeriodEnum {
	RestOfQuarter = "RestOfQuarter",
	RestOfSemester = "RestOfSemester",
	RestOfYear = "RestOfYear",
	NextThreeMonths = "NextThreeMonths",
	NextSixMonths = "NextSixMonths",
	NextTwelveMonths = "NextTwelveMonths",
}

export enum TransactionEnum {
	Income = "Income",
	Expense = "Expense",
	Investment = "Investment",
	Other = "Other",
	None = "None",
}

export enum RecurrenceEnum {
	OneTime = "OneTime",
	Daily = "Daily",
	Weekly = "Weekly",
	Monthly = "Monthly",
	Yearly = "Yearly",
	Custom = "Custom",
	None = "None",
}

export enum PaymentMethodEnum {
	Pix = "Pix",
	Cash = "Cash",
	CreditCard = "CreditCard",
	DebitCard = "DebitCard",
	Other = "Other",
	None = "None",
}

export enum CardEnum {
	Physical = "Physical",
	Virtual = "Virtual",
	Prepaid = "Prepaid",
	NonStop = "NonStop",
	Ticket = "Ticket",
	None = "None",
}

export interface Projection {
	date: CivilDate;
	openingBalance: number;
	income: number;
	creditCardExpenses: number;
	cashEquivalentExpenses: number;
	otherExpenses: number;
	totalExpenses: number;
	netChange: number;
	closingBalance: number;
}

export interface ForecastResponse {
	startDate: CivilDate;
	endDate: CivilDate;
	openingBalance: number;
	closingBalance: number;
	projections: Projection[];
}

export interface BankInfo {
	id?: string;
	name: string;
	card: CardEnum;
}

export interface Payment {
	id?: string;
	amount: number;
	currency?: string;
	frequency?: RecurrenceEnum;
	installment?: number | null;
	method: PaymentMethodEnum;
	bankInfo?: BankInfo | null;
}

export interface Transaction {
	id: string;
	description?: string;
	date: CivilDate;
	type: TransactionEnum;
	payment: Payment;
}

export interface TransactionPayload {
	description: string;
	date: CivilDate;
	type: TransactionEnum;
	payment: {
		amount: number;
		currency: string;
		frequency: RecurrenceEnum;
		installment?: number;
		method: PaymentMethodEnum;
		bankInfo?: {
			name: string;
			card: CardEnum;
		};
	};
}

export const CARD_LABELS: Record<CardEnum, string> = {
	[CardEnum.Physical]: "Fisico",
	[CardEnum.Virtual]: "Virtual",
	[CardEnum.Prepaid]: "Pre-pago",
	[CardEnum.NonStop]: "Multiplo",
	[CardEnum.Ticket]: "Vale",
	[CardEnum.None]: "Nenhum",
};

export const CARD_PAYMENT_METHODS: PaymentMethodEnum[] = [
	PaymentMethodEnum.CreditCard,
	PaymentMethodEnum.DebitCard,
];

export const PERIOD_LABELS: Record<PeriodEnum, string> = {
	[PeriodEnum.RestOfQuarter]: "Resto do Trimestre",
	[PeriodEnum.RestOfSemester]: "Resto do Semestre",
	[PeriodEnum.RestOfYear]: "Resto do Ano",
	[PeriodEnum.NextThreeMonths]: "Proximos 3 Meses",
	[PeriodEnum.NextSixMonths]: "Proximos 6 Meses",
	[PeriodEnum.NextTwelveMonths]: "Proximos 12 Meses",
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionEnum, string> = {
	[TransactionEnum.Income]: "Receita",
	[TransactionEnum.Expense]: "Despesa",
	[TransactionEnum.Investment]: "Investimento",
	[TransactionEnum.Other]: "Outro",
	[TransactionEnum.None]: "Nenhum",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodEnum, string> = {
	[PaymentMethodEnum.Pix]: "Pix",
	[PaymentMethodEnum.Cash]: "Dinheiro",
	[PaymentMethodEnum.CreditCard]: "Cartao de Credito",
	[PaymentMethodEnum.DebitCard]: "Cartao de Debito",
	[PaymentMethodEnum.Other]: "Outro",
	[PaymentMethodEnum.None]: "Nenhum",
};

export const RECURRENCE_LABELS: Record<RecurrenceEnum, string> = {
	[RecurrenceEnum.OneTime]: "Unica",
	[RecurrenceEnum.Daily]: "Diario",
	[RecurrenceEnum.Weekly]: "Semanal",
	[RecurrenceEnum.Monthly]: "Mensal",
	[RecurrenceEnum.Yearly]: "Anual",
	[RecurrenceEnum.Custom]: "Personalizado",
	[RecurrenceEnum.None]: "Nenhum",
};
