import { ThemedText, ThemedView } from "@components/atoms";
import { useAuth } from "@contexts/AuthContext";
import { LoginScreen } from "@feature/auth/LoginScreen";
import { RegisterScreen } from "@feature/auth/RegisterScreen";
import MainTabNavigator from "@navigation/MainTabNavigator";
import { useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

export default function Index() {
	const { isAuthenticated, isLoading } = useAuth();
	const [showRegister, setShowRegister] = useState(false);

	if (isLoading) {
		return (
			<ThemedView style={styles.container}>
				<ActivityIndicator size="large" />
				<ThemedText type="body" style={styles.subtitle}>
					Carregando...
				</ThemedText>
			</ThemedView>
		);
	}

	if (!isAuthenticated) {
		if (showRegister) {
			return <RegisterScreen onLogin={() => setShowRegister(false)} />;
		}
		return <LoginScreen onRegister={() => setShowRegister(true)} />;
	}

	return <MainTabNavigator />;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	subtitle: {
		marginTop: 8,
		opacity: 0.7,
	},
});
