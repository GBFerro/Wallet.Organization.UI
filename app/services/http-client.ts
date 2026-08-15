import { TEXT } from "@constants/text";
import { Toast } from "@contexts/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "@utils/logger";
import axios from "axios";
// @ts-ignore
import type { AxiosRequestConfig, Method } from "axios/index";

const API_BASE_URL = "https://parapodial-lamellarly-lue.ngrok-free.dev";
const TOKEN_KEY = "@monexo:token";
const REFRESH_TOKEN_KEY = "@monexo:refresh-token";

export interface ApiError {
	code: string;
	message: string;
}

export type ApiWarning = ApiError;

export interface ApiResponse<T = unknown> {
	isSuccess: boolean;
	data: T;
	errors: ApiError[];
	warnings: ApiWarning[];
}

export interface RequestConfig
	extends Omit<AxiosRequestConfig, "headers" | "method" | "data" | "params"> {
	requiresAuth?: boolean;
	skipErrorLog?: boolean;
	showToast?: boolean;
	showWarnings?: boolean;
	method?: Method;
	data?: unknown;
	headers?: Record<string, string>;
	params?: Record<string, any>;
}

let toastHandler: ((toast: Omit<Toast, "id">) => void) | null = null;

export function setToastHandler(handler: (toast: Omit<Toast, "id">) => void) {
	toastHandler = handler;
}

let sessionExpiredHandler: (() => void) | null = null;

export function setSessionExpiredHandler(handler: () => void) {
	sessionExpiredHandler = handler;
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
	allowRefresh = true,
): Promise<ApiResponse<T>> {
	const {
		requiresAuth = false,
		skipErrorLog = false,
		showToast: showToastFlag = true,
		showWarnings = true,
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

		if (!data.isSuccess && showToastFlag) {
			notify(data, showWarnings);
		}

		return data;
	} catch (error) {
		const status = (error as { response?: { status?: number } })?.response
			?.status;

		if (status === 401 && requiresAuth) {
			if (allowRefresh && (await ensureFreshToken(showToastFlag))) {
				return request<T>(endpoint, config, false);
			}
			await endSession(showToastFlag);
			return sessionExpiredEnvelope<T>();
		}

		return handleRequestFailure<T>(error, `${method} ${endpoint}`, config);
	}
}

function handleRequestFailure<T>(
	error: unknown,
	label: string,
	config: RequestConfig,
): ApiResponse<T> {
	const {
		skipErrorLog = false,
		showToast: showToastFlag = true,
		showWarnings = true,
	} = config;

	const payload = (error as { response?: { data?: unknown } })?.response?.data;
	const envelope = asApiResponse<T>(payload) ?? asProblemDetails<T>(payload);

	if (envelope) {
		if (!skipErrorLog) {
			logger.error(`[API] ${label} - Envelope de erro:`, envelope.errors);
		}
		if (showToastFlag) {
			notify(envelope, showWarnings);
		}
		return envelope;
	}

	if (!skipErrorLog) {
		const message =
			error instanceof Error ? error.message : TEXT.errors.unknown;
		logger.error(`[API] ${label} - ${message}`);
	}

	if (showToastFlag) {
		toastHandler?.({
			type: "error",
			title: TEXT.errors.network,
			description: TEXT.errors.tryAgain,
		});
	}

	return {
		data: {} as T,
		warnings: [],
		isSuccess: false,
		errors: [{ code: "error.network", message: TEXT.errors.network }],
	};
}

let refreshInFlight: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
	const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
	if (!refreshToken) {
		logger.info("[API] Sem refresh token armazenado");
		return false;
	}

	const result = await request<{ accessToken: string; refreshToken: string }>(
		"/api/auth/refresh-token",
		{ method: "POST", data: { refreshToken }, showToast: false },
	);

	if (!result.isSuccess || !result.data?.accessToken) {
		return false;
	}

	await AsyncStorage.setItem(TOKEN_KEY, result.data.accessToken);
	await AsyncStorage.setItem(REFRESH_TOKEN_KEY, result.data.refreshToken);
	logger.info("[API] Token renovado");

	return true;
}

async function ensureFreshToken(showToastFlag: boolean): Promise<boolean> {
	refreshInFlight ??= refreshAccessToken()
		.then(async (renewed) => {
			if (!renewed) {
				await endSession(showToastFlag);
			}
			return renewed;
		})
		.finally(() => {
			refreshInFlight = null;
		});

	return refreshInFlight;
}

let sessionEnded = false;

export function markSessionActive() {
	sessionEnded = false;
}

async function endSession(showToastFlag: boolean): Promise<void> {
	if (sessionEnded) return;
	sessionEnded = true;

	logger.error("[API] Sessao expirada");
	await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
	sessionExpiredHandler?.();

	if (showToastFlag) {
		toastHandler?.({
			type: "error",
			title: TEXT.errors.unauthorized,
			description: TEXT.errors.sessionExpired,
		});
	}
}

function sessionExpiredEnvelope<T>(): ApiResponse<T> {
	return {
		data: {} as T,
		warnings: [],
		isSuccess: false,
		errors: [
			{
				code: "error.auth.session-expired",
				message: TEXT.errors.sessionExpired,
			},
		],
	};
}

function isEnvelopeShape(value: unknown): value is ApiResponse<unknown> {
	return (
		typeof value === "object" &&
		value !== null &&
		"isSuccess" in value &&
		Array.isArray((value as { errors?: unknown }).errors)
	);
}

function asApiResponse<T>(value: unknown): ApiResponse<T> | null {
	if (!isEnvelopeShape(value)) {
		return null;
	}
	const envelope = value as Partial<ApiResponse<T>> & { isSuccess: boolean };
	return {
		isSuccess: envelope.isSuccess,
		data: (envelope.data ?? {}) as T,
		errors: envelope.errors ?? [],
		warnings: envelope.warnings ?? [],
	};
}

interface ProblemDetails {
	title?: string;
	status?: number;
	errors?: Record<string, string[]>;
}

function asProblemDetails<T>(value: unknown): ApiResponse<T> | null {
	if (typeof value !== "object" || value === null || !("title" in value)) {
		return null;
	}

	const problem = value as ProblemDetails;
	const fieldErrors = Object.entries(problem.errors ?? {}).flatMap(
		([field, messages]) =>
			messages.map((message) => ({ code: field, message })),
	);

	return {
		isSuccess: false,
		data: {} as T,
		warnings: [],
		errors: fieldErrors.length
			? fieldErrors
			: [
					{
						code: "error.bad-request",
						message: problem.title ?? TEXT.errors.unknown,
					},
				],
	};
}

function humanText(entry: ApiError): string {
	const looksLikeKey = (value: string) => /^[a-z0-9._-]+$/.test(value);

	if (entry.message && !looksLikeKey(entry.message)) return entry.message;
	if (entry.code && !looksLikeKey(entry.code)) return entry.code;
	return entry.message || entry.code;
}

function notify(envelope: ApiResponse<unknown>, showWarnings: boolean) {
	if (!toastHandler) return;

	envelope.errors.forEach((e) =>
		toastHandler?.({
			type: "error",
			title: TEXT.common.error,
			description: humanText(e),
		}),
	);

	if (!showWarnings) return;

	envelope.warnings.forEach((w) =>
		toastHandler?.({
			type: "warning",
			title: TEXT.common.warning,
			description: humanText(w),
		}),
	);
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
