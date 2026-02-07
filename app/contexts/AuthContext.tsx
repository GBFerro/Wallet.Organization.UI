import { SignInResponse, signIn, signUp } from "@services/auth";
import { ApiResponse } from "@services/http-client";
import { getToken, getUser, removeToken } from "@services/storage";
import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

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
		name: string,
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

	async function checkAuth() {
		setIsLoading(true);
		const token = await getToken();
		const storedUser = await getUser();

		if (token && storedUser) {
			setUser(storedUser);
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
		name: string,
		email: string,
		password: string,
	): Promise<ApiResponse<unknown>> {
		setIsLoading(true);
		const result = await signUp({ name, email, password });

		if (result.isSuccess) {
			const loginResult = await login(email, password);
			return loginResult;
		}

		setIsLoading(false);
		return result;
	}

	async function logout() {
		await removeToken();
		setUser(null);
	}

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
