import { SignInResponse, signIn, signUp } from "@services/auth";
import { ApiResponse, setSessionExpiredHandler } from "@services/http-client";
import {
	getRefreshToken,
	getToken,
	getUser,
	removeToken,
} from "@services/storage";
import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { InteractionManager } from "react-native";

interface User {
	name: string;
	email: string;
}

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (
		email: string,
		password: string,
	) => Promise<ApiResponse<SignInResponse>>;
	register: (
		username: string,
		email: string,
		password: string,
	) => Promise<ApiResponse>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		checkAuth();
	}, []);

	// Sessao sem refresh token nao sobrevive ao primeiro 401. Montar as abas e
	// derruba-las no frame seguinte quebra o react-native-screens, entao ela e
	// descartada aqui e o login aparece direto.
	async function checkAuth() {
		setIsLoading(true);
		const [token, refreshToken, storedUser] = await Promise.all([
			getToken(),
			getRefreshToken(),
			getUser(),
		]);

		if (token && refreshToken && storedUser) {
			setUser(storedUser);
		} else if (token || storedUser) {
			await removeToken();
		}

		setIsLoading(false);
	}

	async function login(
		email: string,
		password: string,
	): Promise<ApiResponse<SignInResponse>> {
		setIsLoading(true);
		const result = await signIn({ email, password });

		if (result.isSuccess && result.data) {
			setUser({
				name: result.data.username,
				email: result.data.email,
			});
		}

		setIsLoading(false);
		return result;
	}

	async function register(
		username: string,
		email: string,
		password: string,
	): Promise<ApiResponse<unknown>> {
		setIsLoading(true);
		const result = await signUp({ username, email, password });

		if (result.isSuccess) {
			const loginResult = await login(email, password);
			return loginResult;
		}

		setIsLoading(false);
		return result;
	}

	const logout = useCallback(async () => {
		await removeToken();
		setUser(null);
	}, []);

	// Um 401 que a renovacao de token nao resolveu derruba a sessao aqui, e a
	// ausencia de usuario faz `app/index.tsx` voltar para o login. A troca so
	// acontece com a navegacao parada: desmontar as telas nativas no meio de uma
	// transicao fecha o app sem log nenhum. `runAfterInteractions` esta marcada
	// como deprecada, mas e a unica que espera a transicao terminar.
	useEffect(() => {
		setSessionExpiredHandler(() => {
			InteractionManager.runAfterInteractions(() => {
				logout();
			});
		});
	}, [logout]);

	const value = useMemo(
		() => ({
			user,
			isLoading,
			isAuthenticated: !!user,
			login,
			register,
			logout,
		}),
		[user, isLoading],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
