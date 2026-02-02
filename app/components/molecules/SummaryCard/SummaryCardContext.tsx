import type { useTheme } from "@hooks/useTheme";
import { createContext, useContext } from "react";

export interface SummaryCardContextValue {
  theme: ReturnType<typeof useTheme>["theme"];
}

export const SummaryCardContext = createContext<SummaryCardContextValue | null>(null);

export const useSummaryCardContext = () => {
  const context = useContext(SummaryCardContext);
  if (!context) {
    throw new Error("SummaryCard compound components must be used within SummaryCard");
  }
  return context;
};
