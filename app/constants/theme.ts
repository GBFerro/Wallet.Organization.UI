import { Platform } from "react-native";

const primaryEmerald = "#1A9B7F";
const softMint = "#E8F3F0";
const deepNavy = "#1F3A5F";
const offWhite = "#F9FAFB";
const charcoal = "#3A4A5C";
const paleGray = "#F3F4F6";
const softRed = "#EF5350";

const darkEmerald = "#22C39F";
const darkMint = "#1A4A3F";
const darkNavy = "#2A3F5F";
const darkBackground = "#0F1419";
const darkForeground = "#E5E7EB";

export const Colors = {
	light: {
		text: charcoal,
		textSecondary: "#6B7280",
		buttonText: "#FFFFFF",
		tabIconDefault: "#9CA3AF",
		tabIconSelected: primaryEmerald,
		link: primaryEmerald,

		backgroundRoot: offWhite,
		backgroundDefault: "#FFFFFF",
		backgroundSecondary: softMint,
		backgroundTertiary: paleGray,

		border: "#E5E7EB",

		success: primaryEmerald,
		warning: "#F59E0B",
		error: softRed,

		primary: primaryEmerald,
		primaryLight: "#4DB8A1",

		income: primaryEmerald,
		expense: softRed,

		chart1: primaryEmerald,
		chart2: "#5A7BA6",
		chart3: "#F4C430",
		chart4: "#E57373",
		chart5: "#9575CD",

		cardHeader: softMint,
		tableRowAlt: offWhite,
	},
	dark: {
		text: darkForeground,
		textSecondary: "#9CA3AF",
		buttonText: "#FFFFFF",
		tabIconDefault: "#6B7280",
		tabIconSelected: darkEmerald,
		link: darkEmerald,

		backgroundRoot: darkBackground,
		backgroundDefault: "#1A1F26",
		backgroundSecondary: darkMint,
		backgroundTertiary: darkNavy,

		border: "#374151",

		success: darkEmerald,
		warning: "#FBBF24",
		error: "#F87171",

		primary: darkEmerald,
		primaryLight: "#4DB8A1",

		income: darkEmerald,
		expense: "#F87171",

		chart1: darkEmerald,
		chart2: "#5A7BA6",
		chart3: "#F4C430",
		chart4: "#E57373",
		chart5: "#9575CD",

		cardHeader: darkMint,
		tableRowAlt: "#16191F",
	},
};

export const Spacing = {
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 20,
	"2xl": 24,
	"3xl": 32,
	"4xl": 40,
	"5xl": 48,
	inputHeight: 48,
	buttonHeight: 52,
	fabSize: 56,
};

export const BorderRadius = {
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 20,
	"2xl": 24,
	"3xl": 32,
	full: 9999,
};

export const Typography = {
	h1: {
		fontSize: 48,
		fontWeight: "700" as const,
		fontFamily: "Manrope",
	},
	h2: {
		fontSize: 32,
		fontWeight: "700" as const,
		fontFamily: "Manrope",
	},
	h3: {
		fontSize: 24,
		fontWeight: "600" as const,
		fontFamily: "Manrope",
	},

	body: {
		fontSize: 16,
		fontWeight: "400" as const,
		fontFamily: "Inter",
	},
	bodyLarge: {
		fontSize: 18,
		fontWeight: "400" as const,
		fontFamily: "Inter",
	},
	label: {
		fontSize: 16,
		fontWeight: "500" as const,
		fontFamily: "Inter",
	},
	caption: {
		fontSize: 13,
		fontWeight: "400" as const,
		fontFamily: "Inter",
	},
	captionSmall: {
		fontSize: 12,
		fontWeight: "400" as const,
		fontFamily: "Inter",
	},

	title: {
		fontSize: 32,
		fontWeight: "700" as const,
		fontFamily: "Manrope",
	},
	heading: {
		fontSize: 24,
		fontWeight: "700" as const,
		fontFamily: "Manrope",
	},
	subheading: {
		fontSize: 20,
		fontWeight: "600" as const,
		fontFamily: "Inter",
	},
	link: {
		fontSize: 16,
		fontWeight: "400" as const,
		fontFamily: "Inter",
	},
	currency: {
		fontSize: 16,
		fontWeight: "600" as const,
		fontFamily: "JetBrainsMono",
	},
};

export const Fonts = Platform.select({
	ios: {
		display: "Manrope",
		sans: "Inter",
		fallback: "system-ui",
		mono: "JetBrainsMono",
	},
	default: {
		display: "Manrope",
		sans: "Inter",
		fallback: "normal",
		mono: "JetBrainsMono",
	},
	web: {
		display:
			"'Manrope', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
		sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
		fallback:
			"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
		mono: "'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
	},
});

export const Effects = {
	cardShadow: {
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.05,
		shadowRadius: 20,
		elevation: 4,
	},
	softShadow: {
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.05,
		shadowRadius: 20,
		elevation: 2,
	},
	primaryGlow: {
		shadowColor: primaryEmerald,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.3,
		shadowRadius: 20,
		elevation: 0,
	},
	focusRing: {
		borderColor: primaryEmerald,
		borderWidth: 2,
		shadowColor: primaryEmerald,
		shadowOpacity: 0.3,
		shadowRadius: 8,
	},
	glass: {
		backgroundColor: "rgba(255, 255, 255, 0.8)",
	},
	glassCard: {
		backgroundColor: "rgba(255, 255, 255, 0.6)",
	},
};
