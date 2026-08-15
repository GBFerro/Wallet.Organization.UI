import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "@utils/logger";

const TOKEN_KEY = "@monexo:token";
const REFRESH_TOKEN_KEY = "@monexo:refresh-token";
const USER_KEY = "@monexo:user";

export interface User {
	name: string;
	email: string;
}

export async function saveToken(token: string): Promise<void> {
	await AsyncStorage.setItem(TOKEN_KEY, token);
	logger.info("[Auth] Token saved");
}

export async function getToken(): Promise<string | null> {
	return AsyncStorage.getItem(TOKEN_KEY);
}

export async function saveRefreshToken(token: string): Promise<void> {
	await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export async function getRefreshToken(): Promise<string | null> {
	return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function removeToken(): Promise<void> {
	await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
	logger.info("[Auth] Token removed");
}

export async function saveUser(user: User): Promise<void> {
	await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
	logger.info("[Auth] User data saved");
}

export async function getUser(): Promise<User | null> {
	const user = await AsyncStorage.getItem(USER_KEY);
	return user ? JSON.parse(user) : null;
}
