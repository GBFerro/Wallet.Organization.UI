import {
	type ApiResponse,
	httpClient,
	markSessionActive,
} from "@services/http-client";
import { saveRefreshToken, saveToken, saveUser } from "@services/storage";
import { logger } from "@utils/logger";

export interface SignUpRequest {
	username: string;
	email: string;
	password: string;
}

export interface SignInRequest {
	email: string;
	password: string;
}

export interface SignUpResponse {
	id: string;
	username: string;
	email: string;
	role: string;
	createdAt: string;
}

export interface SignInResponse {
	accessToken: string;
	refreshToken: string;
	username: string;
	email: string;
}

export async function signUp(
	data: SignUpRequest,
): Promise<ApiResponse<SignUpResponse>> {
	return await httpClient.post<SignUpResponse>("/api/auth/sign-up", data, {
		showToast: false,
	});
}

export async function signIn(
	data: SignInRequest,
): Promise<ApiResponse<SignInResponse>> {
	const result = await httpClient.post<SignInResponse>(
		"/api/auth/sign-in",
		data,
		{ showToast: false },
	);

	if (result.isSuccess && result.data?.accessToken) {
		await persistSession(result.data);
		logger.info("[Auth] Sign in successful");
	}

	return result;
}

async function persistSession(session: SignInResponse): Promise<void> {
	await saveToken(session.accessToken);
	await saveRefreshToken(session.refreshToken);
	await saveUser({ name: session.username, email: session.email });
	markSessionActive();
}
