import {
	CardEnum,
	PaymentMethodEnum,
	RecurrenceEnum,
	Transaction,
	TransactionEnum,
} from "@constants/api";
import { type ApiResponse, httpClient } from "@services/http-client";
import { logger } from "@utils/logger";

export interface CreateTransactionRequest {
	description: string;
	date: string;
	type: TransactionEnum;
	payment: {
		amount: number;
		currency: string;
		frequency: RecurrenceEnum;
		installment?: number;
		method: PaymentMethodEnum;
		bankInfo: {
			name: string;
			card: CardEnum;
		};
	};
}

export async function fetchTransactions({
	type,
	paymentType,
}: {
	type?: TransactionEnum;
	paymentType?: PaymentMethodEnum;
}): Promise<ApiResponse<Transaction[]>> {
	const params = {
		type,
		paymentType,
	};
	const result = await httpClient.get<any>(`/api/transactions`, {
		requiresAuth: true,
		params,
	});

	logger.info(`[Transactions] Found ${result.data.length} transactions`);

	return result;
}

export async function createTransaction(
	data: CreateTransactionRequest,
): Promise<ApiResponse<Transaction>> {
	const result = await httpClient.post<any>("/api/transactions", data, {
		requiresAuth: true,
	});

	logger.info(
		`[Transactions] Transaction ${result.data.id} created successfully`,
	);
	return result;
}

export async function updateTransaction(
	id: string,
	data: CreateTransactionRequest,
): Promise<ApiResponse<Transaction>> {
	const result = await httpClient.put<any>(`/api/transactions/${id}`, data, {
		requiresAuth: true,
	});

	logger.info(`[Transactions] Transaction ${id} updated successfully`);

	return result;
}

export async function deleteTransaction(
	id: string,
): Promise<ApiResponse<void>> {
	const result = await httpClient.delete<void>(`/api/transactions/${id}`, {
		requiresAuth: true,
	});

	logger.info(`[Transactions] Transaction ${id} deleted successfully`);
	return result;
}
