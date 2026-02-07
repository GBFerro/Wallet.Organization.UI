import type { Projection } from "@constants/api";
import { useTheme } from "@hooks/useTheme";
import React, { createContext, useContext } from "react";

export interface MonthData {
	month: string;
	year: number;
	monthIndex: number;
	projections: Projection[];
	totalIncome: number;
	totalExpenses: number;
	finalBalance: number;
}

export interface MonthCardProps {
	monthData: MonthData;
	children: React.ReactNode;
}

export interface MonthCardContextValue {
	monthData: MonthData;
	theme: ReturnType<typeof useTheme>["theme"];
	expanded: boolean;
	toggleExpand: () => void;
	selectedDay: Projection | null;
	setSelectedDay: (day: Projection | null) => void;
	projectionMap: Map<number, Projection>;
}

export const MonthCardContext = createContext<MonthCardContextValue | null>(
	null,
);

export function useMonthCardContext() {
	const context = useContext(MonthCardContext);
	if (!context) {
		throw new Error(
			"MonthCard compound components must be used within MonthCard",
		);
	}
	return context;
}

export type { Projection } from "@constants/api";
