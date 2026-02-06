import type { useTheme } from "@hooks/useTheme";
import { createContext, useContext } from "react";

export interface CardContextValue {
	elevation: number;
	theme: ReturnType<typeof useTheme>["theme"];
}

export const CardContext = createContext<CardContextValue | null>(null);

export const useCardContext = () => {
	const context = useContext(CardContext);
	if (!context) {
		throw new Error("Card compound components must be used within Card");
	}
	return context;
};
