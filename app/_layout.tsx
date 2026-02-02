import { ErrorBoundary } from "@components/layout";
import { AuthProvider } from "@contexts/AuthContext";
import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </ErrorBoundary>
  );
}
