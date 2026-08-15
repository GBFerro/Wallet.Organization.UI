import {
	PaymentMethodEnum,
	Transaction,
	TransactionEnum,
	TransactionPayload,
} from "@constants/api";
import { type ApiResponse, httpClient } from "@services/http-client";
import { logger } from "@utils/logger";

export interface DeleteTransactionResponse {
	deleted: boolean;
}

export async function fetchTransactions({
	type,
	paymentType,
}: {
	type?: TransactionEnum;
	paymentType?: PaymentMethodEnum;
}): Promise<ApiResponse<Transaction[]>> {
	const result = await httpClient.get<Transaction[]>("/api/transactions", {
		requiresAuth: true,
		params: { type, paymentType },
		showWarnings: false,
	});

	if (result.isSuccess) {
		logger.info(`[Transactions] Found ${result.data.length} transactions`);
	}

	return result;
}

export async function fetchTransactionById(
	id: string,
): Promise<ApiResponse<Transaction>> {
	return await httpClient.get<Transaction>(`/api/transactions/${id}`, {
		requiresAuth: true,
	});
}

export async function createTransaction(
	data: TransactionPayload,
): Promise<ApiResponse<Transaction>> {
	const result = await httpClient.post<Transaction>("/api/transactions", data, {
		requiresAuth: true,
	});

	if (result.isSuccess) {
		logger.info(`[Transactions] Transaction ${result.data.id} created`);
	}

	return result;
}

export async function updateTransaction(
	id: string,
	data: TransactionPayload,
): Promise<ApiResponse<Transaction>> {
	const result = await httpClient.put<Transaction>(
		`/api/transactions/${id}`,
		data,
		{ requiresAuth: true },
	);

	if (result.isSuccess) {
		logger.info(`[Transactions] Transaction ${id} updated`);
	}

	return result;
}

export async function deleteTransaction(
	id: string,
): Promise<ApiResponse<DeleteTransactionResponse>> {
	const result = await httpClient.delete<DeleteTransactionResponse>(
		`/api/transactions/${id}`,
		{ requiresAuth: true },
	);

	if (result.isSuccess) {
		logger.info(
			`[Transactions] Transaction ${id} deleted: ${result.data.deleted}`,
		);
	}

	return result;
}
