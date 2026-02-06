import { type ApiResponse, httpClient } from "@services/http-client";
import { saveToken, saveUser } from "@services/storage";
import { logger } from "@utils/logger";

export interface SignUpRequest {
	name: string;
	email: string;
	password: string;
}

export interface SignInRequest {
	email: string;
	password: string;
}

export interface SignInResponse {
	accessToken: string;
	refreshToken: string;
	username: string;
	email: string;
}

export async function signUp(data: SignUpRequest): Promise<ApiResponse<void>> {
	return await httpClient.post<void>("/api/auth/sign-up", data, {
		showToast: false,
	});
}

export async function signIn(
	data: SignInRequest,
): Promise<ApiResponse<SignInResponse>> {
	const result = await httpClient.post<any>("/api/auth/sign-in", data, {
		mode: "cors" as RequestMode,
		showToast: false,
	});

	if (result.data?.accessToken) {
		await saveToken(result.data.accessToken);
		await saveUser({ name: result.data.username, email: result.data.email });
		logger.info("[Auth] Sign in successful");
	}

	return result;
}
