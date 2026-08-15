import { createContext, useContext } from "react";
import type { TransactionDraft } from "./rules";

export interface TransactionFormContextValue {
	draft: TransactionDraft;
	update: (patch: Partial<TransactionDraft>) => void;
	apply: (transition: (draft: TransactionDraft) => TransactionDraft) => void;
}

export const TransactionFormContext =
	createContext<TransactionFormContextValue | null>(null);

export function useTransactionFormContext() {
	const context = useContext(TransactionFormContext);
	if (!context) {
		throw new Error(
			"TransactionForm fields must be used within TransactionForm",
		);
	}
	return context;
}
