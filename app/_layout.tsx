import { ToastContainer } from "@components/atoms/Toast/ToastContainer";
import { ErrorBoundary } from "@components/layout";
import { AuthProvider } from "@contexts/AuthContext";
import { EventProvider } from "@contexts/EventContext";
import { ThemeProvider } from "@contexts/ThemeContext";
import { ToastProvider } from "@contexts/ToastContext";
import { useApiToastIntegration } from "@hooks/useApiToastIntegration";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "./global.css";

SplashScreen.preventAutoHideAsync();

function AppContent() {
	useApiToastIntegration();

	useEffect(() => {
		SplashScreen.hideAsync();
	}, []);

	return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
	return (
		<ThemeProvider>
			<ErrorBoundary>
				<EventProvider>
					<ToastProvider>
						<AuthProvider>
							<AppContent />
						</AuthProvider>
						<ToastContainer />
					</ToastProvider>
				</EventProvider>
			</ErrorBoundary>
		</ThemeProvider>
	);
}
