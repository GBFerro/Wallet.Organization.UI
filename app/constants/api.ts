export enum PeriodEnum {
	ThisYear = "ThisYear",
	Year = "Year",
	ThisSemester = "ThisSemester",
	Semester = "Semester",
	ThisQuarter = "ThisQuarter",
	Quarter = "Quarter",
	ThisTrimester = "ThisTrimester",
	Trimester = "Trimester",
	None = "None",
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
	date: string;
	net: number;
	income: number;
	cardExpenses: number;
	debitExpenses: number;
	otherExpenses: number;
	totalExpenses: number;
	currentAmount: number;
}

export interface ForecastResponse {
	startDate: string;
	projections: Projection[];
}

export interface BankInfo {
	id?: string;
	name?: string;
	card: CardEnum;
}

export interface Payment {
	id?: string;
	amount: number;
	currency?: string;
	frequency?: RecurrenceEnum;
	installment?: number;
	method: PaymentMethodEnum;
	bankInfo?: BankInfo;
}

export interface Transaction {
	id: string;
	description?: string;
	date: string;
	type: TransactionEnum;
	payment: Payment;
}

export const PERIOD_LABELS: Record<PeriodEnum, string> = {
	[PeriodEnum.ThisYear]: "Este Ano",
	[PeriodEnum.Year]: "Ano",
	[PeriodEnum.ThisSemester]: "Este Semestre",
	[PeriodEnum.Semester]: "Semestre",
	[PeriodEnum.ThisQuarter]: "Este Trimestre",
	[PeriodEnum.Quarter]: "Trimestre",
	[PeriodEnum.ThisTrimester]: "Este Bimestre",
	[PeriodEnum.Trimester]: "Bimestre",
	[PeriodEnum.None]: "Todos",
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
