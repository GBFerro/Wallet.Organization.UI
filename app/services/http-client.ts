import { Toast } from "@contexts/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "@utils/logger";
import axios from "axios";
// @ts-ignore
import type { AxiosRequestConfig, Method } from "axios/index";

const API_BASE_URL = "https://parapodial-lamellarly-lue.ngrok-free.dev";
const TOKEN_KEY = "@monexo:token";

interface Error {
	code: string;
	message: string;
}

type Warning = Error;

export interface ApiResponse<T = unknown> {
	isSuccess: boolean;
	data: T;
	errors: Error[];
	warnings: Warning[];
}

export interface RequestConfig
	extends Omit<AxiosRequestConfig, "headers" | "method" | "data" | "params"> {
	requiresAuth?: boolean;
	skipErrorLog?: boolean;
	showToast?: boolean;
	method?: Method;
	data?: unknown;
	headers?: Record<string, string>;
	params?: Record<string, any>;
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
		data: body,
		headers = {},
		params,
		...restConfig
	} = config;

	const url = `${API_BASE_URL}${endpoint}`;

	logger.info(`[API] ${method} ${endpoint}`);

	try {
		const requestHeaders = requiresAuth
			? await getAuthHeaders()
			: { ...defaultHeaders, ...headers };

		const axiosConfig: AxiosRequestConfig = {
			url,
			method: method as AxiosRequestConfig["method"],
			headers: requestHeaders,
			data: body,
			params,
			...restConfig,
		};

		const response = await axios.request<ApiResponse<T>>(axiosConfig);
		logger.info(`[API] ${method} ${endpoint} - Status: ${response.status}`);
		const data = response.data;
		logger.debug(`[API] ${method} ${endpoint} - Response:`, data);

		if (!data.isSuccess && showToastFlag && toastHandler) {
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
		let message = "Erro desconhecido";

		if (error && typeof error === "object" && "isAxiosError" in error) {
			message = (error as { message?: string }).message ?? message;
			logger.error(`[API] ${method} ${endpoint} - AxiosError:`, message);
		} else if (error instanceof Error) {
			message = error.message;
			logger.error(`[API] ${method} ${endpoint} - Error:`, message);
		}

		if (toastHandler) {
			toastHandler({
				type: "error",
				title: "Erro de Conexao",
				description: "Ocorreu um erro",
			});
		}

		return {
			data: {} as T,
			warnings: [],
			isSuccess: false,
			errors: [{ code: "Erro.Inexperado", message: "Ocorreu um erro" }],
		};
	}
}

export const httpClient = {
	get: <T>(
		endpoint: string,
		config?: Omit<RequestConfig, "method" | "data">,
	): Promise<ApiResponse<T>> =>
		request<T>(endpoint, { ...config, method: "GET" }),

	post: <T>(
		endpoint: string,
		body?: unknown,
		config?: Omit<RequestConfig, "method" | "data">,
	): Promise<ApiResponse<T>> =>
		request<T>(endpoint, { ...config, method: "POST", data: body }),

	put: <T>(
		endpoint: string,
		body?: unknown,
		config?: Omit<RequestConfig, "method" | "data">,
	): Promise<ApiResponse<T>> =>
		request<T>(endpoint, { ...config, method: "PUT", data: body }),

	delete: <T>(
		endpoint: string,
		config?: Omit<RequestConfig, "method" | "data">,
	): Promise<ApiResponse<T>> =>
		request<T>(endpoint, { ...config, method: "DELETE" }),

	patch: <T>(
		endpoint: string,
		body?: unknown,
		config?: Omit<RequestConfig, "method" | "data">,
	): Promise<ApiResponse<T>> =>
		request<T>(endpoint, { ...config, method: "PATCH", data: body }),
};
