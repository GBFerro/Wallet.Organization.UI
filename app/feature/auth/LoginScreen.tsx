import { ThemedText, ThemedView } from "@components/atoms";
import { TEXT } from "@constants/text";
import { BorderRadius, Spacing } from "@constants/theme";
import { useAuth } from "@contexts/AuthContext";
import { Feather } from "@expo/vector-icons";
import { usePressed } from "@hooks/usePressed";
import { useTheme } from "@hooks/useTheme";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Image,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	TextInput,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface LoginScreenProps {
	onRegister: () => void;
}

export function LoginScreen({ onRegister }: Readonly<LoginScreenProps>) {
	const { theme } = useTheme();
	const loginPress = usePressed();
	const { login, isLoading } = useAuth();
	const insets = useSafeAreaInsets();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");

	async function handleLogin(): Promise<void> {
		if (!email.trim() || !password.trim()) {
			setError(TEXT.auth.errorFillFields);
			return;
		}

		const result = await login(email, password);
		if (!result?.isSuccess) {
			setError(result.errors?.[0]?.message || TEXT.auth.errorLogin);
		}
	}

	return (
		<ThemedView style={styles.container}>
			<KeyboardAvoidingView
				style={styles.keyboardView}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<ScrollView
					contentContainerStyle={[
						styles.scrollContent,
						{
							paddingTop: insets.top + Spacing["3xl"],
							paddingBottom: insets.bottom + Spacing["3xl"],
						},
					]}
					keyboardShouldPersistTaps="handled"
				>
					<View style={styles.header}>
						<Image
							source={require("@assets/images/Monexo-icon.png")}
							style={[styles.logoContainer]}
							accessibilityLabel="Logo Monexo"
						/>
						<ThemedText type="title" style={styles.title}>
							{TEXT.appName}
						</ThemedText>
						<ThemedText type="body" style={{ color: theme.textSecondary }}>
							{TEXT.auth.loginTitle}
						</ThemedText>
					</View>

					<View style={styles.form}>
						{error ? (
							<View
								style={[
									styles.errorContainer,
									{ backgroundColor: theme.expense + "20" },
								]}
							>
								<Feather name="alert-circle" size={20} color={theme.expense} />
								<ThemedText
									type="body"
									style={{ color: theme.expense, flex: 1 }}
								>
									{error}
								</ThemedText>
							</View>
						) : null}

						<View style={styles.inputGroup}>
							<ThemedText type="caption" style={{ color: theme.textSecondary }}>
								{TEXT.auth.emailLabel}
							</ThemedText>
							<View
								style={[
									styles.inputContainer,
									{ backgroundColor: theme.backgroundDefault },
								]}
							>
								<Feather name="mail" size={20} color={theme.textSecondary} />
								<TextInput
									style={[styles.input, { color: theme.text }]}
									placeholder={TEXT.auth.emailPlaceholder}
									placeholderTextColor={theme.textSecondary}
									value={email}
									onChangeText={setEmail}
									keyboardType="email-address"
									autoCapitalize="none"
									autoCorrect={false}
								/>
							</View>
						</View>

						<View style={styles.inputGroup}>
							<ThemedText type="caption" style={{ color: theme.textSecondary }}>
								{TEXT.auth.passwordLabel}
							</ThemedText>
							<View
								style={[
									styles.inputContainer,
									{ backgroundColor: theme.backgroundDefault },
								]}
							>
								<Feather name="lock" size={20} color={theme.textSecondary} />
								<TextInput
									style={[styles.input, { color: theme.text }]}
									placeholder={TEXT.auth.passwordPlaceholder}
									placeholderTextColor={theme.textSecondary}
									value={password}
									onChangeText={setPassword}
									secureTextEntry={!showPassword}
								/>
								<Pressable onPress={() => setShowPassword(!showPassword)}>
									<Feather
										name={showPassword ? "eye-off" : "eye"}
										size={20}
										color={theme.textSecondary}
									/>
								</Pressable>
							</View>
						</View>

						<Pressable
							{...loginPress.pressHandlers}
							style={[
								styles.loginButton,
								{
									backgroundColor: theme.primary,
									opacity: loginPress.pressed || isLoading ? 0.8 : 1,
								},
							]}
							onPress={handleLogin}
							disabled={isLoading}
						>
							{isLoading ? (
								<ActivityIndicator color="#FFFFFF" />
							) : (
								<ThemedText
									type="body"
									style={{ color: "#FFFFFF", fontWeight: "600" }}
								>
									{TEXT.auth.loginButton}
								</ThemedText>
							)}
						</Pressable>
					</View>

					<View style={styles.footer}>
						<ThemedText type="body" style={{ color: theme.textSecondary }}>
							{TEXT.auth.noAccount}
						</ThemedText>
						<Pressable onPress={onRegister}>
							<ThemedText
								type="body"
								style={{ color: theme.primary, fontWeight: "600" }}
							>
								{" "}
								{TEXT.auth.signUp}
							</ThemedText>
						</Pressable>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	keyboardView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: Spacing.xl,
		justifyContent: "center",
	},
	header: {
		alignItems: "center",
		marginBottom: Spacing["3xl"],
	},
	logoContainer: {
		width: 80,
		height: 80,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: Spacing.lg,
	},
	title: {
		marginBottom: Spacing.xs,
	},
	form: {
		gap: Spacing.lg,
		marginBottom: Spacing["3xl"],
	},
	errorContainer: {
		flexDirection: "row",
		alignItems: "center",
		padding: Spacing.sm,
		borderRadius: BorderRadius.sm,
		gap: Spacing.sm,
		height: Spacing["5xl"],
	},
	inputGroup: {
		gap: Spacing.xs,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.md,
		borderRadius: BorderRadius.sm,
		gap: Spacing.sm,
	},
	input: {
		flex: 1,
		fontSize: 16,
		padding: 0,
	},
	loginButton: {
		paddingVertical: Spacing.lg,
		borderRadius: BorderRadius.sm,
		alignItems: "center",
		marginTop: Spacing.md,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
	},
});
