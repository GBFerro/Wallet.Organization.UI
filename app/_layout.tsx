import { ToastContainer } from "@components/atoms/Toast/ToastContainer";
import { ErrorBoundary } from "@components/layout";
import { AuthProvider } from "@contexts/AuthContext";
import { ThemeProvider } from "@contexts/ThemeContext";
import { ToastProvider } from "@contexts/ToastContext";
import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
	return (
		<ErrorBoundary>
			<ThemeProvider>
				<ToastProvider>
					<AuthProvider>
						<Stack screenOptions={{ headerShown: false }} />
					</AuthProvider>
					<ToastContainer />
				</ToastProvider>
			</ThemeProvider>
		</ErrorBoundary>
	);
}
