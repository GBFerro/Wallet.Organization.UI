import { Projection } from "@constants/api";
import { createContext, useContext } from "react";
import { Easing } from "react-native-reanimated";

export interface MonthCardContextValue {
	projections: Projection[];
	monthName: string;
	year: number;
	monthIndex: number;
	expanded: boolean;
	toggleExpand: () => void;
	selectedDay: Projection | null;
	setSelectedDay: (day: Projection | null) => void;
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

export const EASE_IN_OUT = Easing.bezier(0.42, 0, 0.58, 1);
