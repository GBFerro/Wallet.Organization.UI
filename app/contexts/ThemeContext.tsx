import { Colors } from "@constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useColorScheme as useDeviceColorScheme } from "react-native";

type ColorScheme = "light" | "dark";
type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
	colorScheme: ColorScheme;
	themeMode: ThemeMode;
	setThemeMode: (mode: ThemeMode) => Promise<void>;
	theme: typeof Colors.light;
	isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = "@ledgernote:theme_mode";

export function ThemeProvider({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const deviceColorScheme = useDeviceColorScheme();
	const [themeMode, setThemeMode] = useState<ThemeMode>("system");

	useEffect(() => {
		const loadThemeMode = async () => {
			try {
				const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
				if (
					savedMode &&
					(savedMode === "light" ||
						savedMode === "dark" ||
						savedMode === "system")
				) {
					setThemeMode(savedMode as ThemeMode);
				}
			} catch (error) {
				console.error("Failed to load theme mode:", error);
			}
		};

		loadThemeMode();
	}, []);

	const colorScheme: ColorScheme = useMemo(() => {
		if (themeMode === "system") {
			return deviceColorScheme === "dark" ? "dark" : "light";
		}
		return themeMode;
	}, [themeMode, deviceColorScheme]);

	const updateThemeMode = useCallback(async (mode: ThemeMode) => {
		try {
			await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
			setThemeMode(mode);
		} catch (error) {
			console.error("Failed to save theme mode:", error);
		}
	}, []);

	const theme = Colors[colorScheme];
	const isDark = colorScheme === "dark";

	const value: ThemeContextValue = useMemo(
		() => ({
			colorScheme,
			themeMode,
			setThemeMode: updateThemeMode,
			theme,
			isDark,
		}),
		[colorScheme, themeMode, updateThemeMode, theme, isDark],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export function useThemeContext() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useThemeContext must be used within ThemeProvider");
	}
	return context;
}
