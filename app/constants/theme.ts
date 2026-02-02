import { Platform } from "react-native";

const primaryBlue = "#1E3A8A";
const primaryBlueLight = "#3B82F6";

export const Colors = {
  light: {
    text: "#111827",
    textSecondary: "#6B7280",
    buttonText: "#FFFFFF",
    tabIconDefault: "#6B7280",
    tabIconSelected: primaryBlue,
    link: primaryBlue,
    backgroundRoot: "#FFFFFF",
    backgroundDefault: "#F9FAFB",
    backgroundSecondary: "#F3F4F6",
    backgroundTertiary: "#E5E7EB",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    primary: primaryBlue,
    primaryLight: primaryBlueLight,
    income: "#10B981",
    expense: "#EF4444",
    cardHeader: "#F3F4F6",
    tableRowAlt: "#F9FAFB",
  },
  dark: {
    text: "#F9FAFB",
    textSecondary: "#9CA3AF",
    buttonText: "#FFFFFF",
    tabIconDefault: "#6B7280",
    tabIconSelected: primaryBlueLight,
    link: primaryBlueLight,
    backgroundRoot: "#1F2937",
    backgroundDefault: "#374151",
    backgroundSecondary: "#4B5563",
    backgroundTertiary: "#6B7280",
    border: "#4B5563",
    success: "#34D399",
    warning: "#FBBF24",
    error: "#F87171",
    primary: primaryBlueLight,
    primaryLight: primaryBlue,
    income: "#34D399",
    expense: "#F87171",
    cardHeader: "#374151",
    tableRowAlt: "#374151",
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
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700" as const,
  },
  subheading: {
    fontSize: 24,
    fontWeight: "600" as const,
  },
  label: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  currency: {
    fontSize: 16,
    fontWeight: "500" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
