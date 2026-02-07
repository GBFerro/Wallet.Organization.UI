export function formatCurrency(
	value: number,
	currency: string = "BRL",
): string {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency,
	}).format(value);
}

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(date);
}

export function formatShortDate(dateString: string): string {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "short",
	}).format(date);
}

export function formatDayMonth(dateString: string): string {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
	}).format(date);
}

export function getDayOfWeek(dateString: string): string {
	const date = new Date(dateString);
	const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
	return days[date.getUTCDay()];
}

export function getSplitedDate(): { day: number; month: number; year: number } {
	const date = new Date();

	return {
		day: date.getUTCDay() + 1,
		month: date.getUTCMonth() + 1,
		year: date.getUTCFullYear(),
	};
}
