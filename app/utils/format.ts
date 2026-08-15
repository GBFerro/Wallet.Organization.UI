const CIVIL_DATE = /^(\d{4})-(\d{2})-(\d{2})/;

export function parseCivilDate(value: string): Date {
	const match = CIVIL_DATE.exec(value);
	if (!match) {
		return new Date(value);
	}
	return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function toCivilDate(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}

export function parseAmount(value: string): number {
	const normalized = value.includes(",")
		? value.replaceAll(".", "").replace(",", ".")
		: value;
	return Number.parseFloat(normalized);
}

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
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(parseCivilDate(dateString));
}

export function formatShortDate(dateString: string): string {
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "short",
	}).format(parseCivilDate(dateString));
}

export function formatDayMonth(dateString: string): string {
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
	}).format(parseCivilDate(dateString));
}

export function formatMonthName(year: number, monthIndex: number): string {
	const name = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
		new Date(year, monthIndex, 1),
	);
	return name.charAt(0).toUpperCase() + name.slice(1);
}

export function getDayOfWeek(dateString: string): string {
	const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
	return days[parseCivilDate(dateString).getDay()];
}

export function getSplitedDate(): { day: number; month: number; year: number } {
	const today = new Date();
	const month = today.getMonth() + 1;
	const day = today.getDate();
	const year = today.getFullYear();

	return {
		day,
		month,
		year,
	};
}
