import { Toast } from "@contexts/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "@utils/logger";

const API_BASE_URL = "https://parapodial-lamellarly-lue.ngrok-free.dev";
const TOKEN_KEY = "@monexo:token";

export interface ApiResponse<T = unknown> {
	isSuccess: boolean;
	data: T;
	errors: Error[];
	warnings: Warning[];
}

interface Error {
	code: string;
	message: string;
}

type Warning = Error;

export interface RequestConfig extends RequestInit {
	requiresAuth?: boolean;
	skipErrorLog?: boolean;
	showToast?: boolean;
}

let toastHandler: ((toast: Omit<Toast, "id">) => void) | null = null;

export function setToastHandler(handler: (toast: Omit<Toast, "id">) => void) {
	toastHandler = handler;
}

const defaultHeaders = {
	"Content-Type": "application/json",
	"ngrok-skip-browser-warning": "true",
};

async function getAuthHeaders(): Promise<Record<string, string>> {
	const token = await AsyncStorage.getItem(TOKEN_KEY);
	return {
		...defaultHeaders,
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};
}

async function request<T>(
	endpoint: string,
	config: RequestConfig = {},
): Promise<ApiResponse<T>> {
	const {
		requiresAuth = false,
		skipErrorLog = false,
		showToast: showToastFlag = true,
		method = "GET",
		body,
		headers = {},
		...restConfig
	} = config;

	const url = `${API_BASE_URL}${endpoint}`;

	logger.info(`[API] ${method} ${endpoint}`);

	try {
		const requestHeaders = requiresAuth
			? await getAuthHeaders()
			: { ...defaultHeaders, ...headers };

		const response = await fetch(url, {
			method,
			headers: requestHeaders,
			body: body ? JSON.stringify(body) : undefined,
			...restConfig,
		});

		logger.info(
			`[API] ${method} ${endpoint} - Status: ${JSON.stringify(response.body)}`,
		);

		const data: ApiResponse<T> = await response.json();
		logger.debug(`[API] ${method} ${endpoint} - Response:`, data);

		if (!data.isSuccess && showToastFlag) {
			data.errors.forEach((e) =>
				toastHandler({ type: "error", title: e.code, description: e.message }),
			);
			data.warnings.forEach((w) =>
				toastHandler({
					type: "warning",
					title: w.code,
					description: w.message,
				}),
			);
		}

		return data;
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Erro desconhecido";
		logger.error(`[API] ${method} ${endpoint} - Error:`, message);

		toastHandler({
			type: "error",
			title: "Erro de Conexao",
			description: "Ocorreu um erro",
		});

		return {
			data: {} as T,
			warnings: [],
			isSuccess: false,
			errors: [{ code: "Erro.Inexperado", message: "Ocorreu um erro" }],
		};
	}
}

export const httpClient = {
	get: <T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> =>
		request<T>(endpoint, { ...config, method: "GET" }),

	post: <T>(
		endpoint: string,
		body?: unknown,
		config?: RequestConfig,
	): Promise<ApiResponse<T>> =>
		request<T>(endpoint, { ...config, method: "POST", body: body as any }),

	put: <T>(
		endpoint: string,
		body?: unknown,
		config?: RequestConfig,
	): Promise<ApiResponse<T>> =>
		request<T>(endpoint, { ...config, method: "PUT", body: body as any }),

	delete: <T>(
		endpoint: string,
		config?: RequestConfig,
	): Promise<ApiResponse<T>> =>
		request<T>(endpoint, { ...config, method: "DELETE" }),

	patch: <T>(
		endpoint: string,
		body?: unknown,
		config?: RequestConfig,
	): Promise<ApiResponse<T>> =>
		request<T>(endpoint, { ...config, method: "PATCH", body: body as any }),
};
