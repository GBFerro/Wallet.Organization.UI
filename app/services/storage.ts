import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "@utils/logger";

const TOKEN_KEY = "@monexo:token";
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

export async function removeToken(): Promise<void> {
	await AsyncStorage.removeItem(TOKEN_KEY);
	await AsyncStorage.removeItem(USER_KEY);
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
