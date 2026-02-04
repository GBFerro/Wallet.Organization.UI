import { Colors } from "@constants/theme";
import { useThemeContext } from "@contexts/ThemeContext";

export function useTheme() {
	return useThemeContext();
}

export type Theme = typeof Colors.light;
