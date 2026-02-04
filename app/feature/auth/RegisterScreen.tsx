import { ThemedText } from "@components/atoms/ThemedText";
import { ThemedView } from "@components/atoms/ThemedView";
import { TEXT } from "@constants/text";
import { BorderRadius, Spacing } from "@constants/theme";
import { useAuth } from "@contexts/AuthContext";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RegisterScreenProps {
  onLogin: () => void;
}

export function RegisterScreen({ onLogin }: Readonly<RegisterScreenProps>) {
  const { theme } = useTheme();
  const { register } = useAuth();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError(TEXT.auth.errorFillFields);
      return;
    }

    if (password !== confirmPassword) {
      setError(TEXT.auth.errorPasswordMismatch);
      return;
    }

    if (password.length < 6) {
      setError(TEXT.auth.errorPasswordLength);
      return;
    }

    setIsLoading(true);
    setError("");

    const result = await register(name, email, password);

    if (!result.success) {
      setError(result.message || TEXT.auth.errorRegister);
    }

    setIsLoading(false);
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
            <View style={[styles.logoContainer, { backgroundColor: theme.primary }]}>
              <Feather name="trending-up" size={40} color="#FFFFFF" />
            </View>
            <ThemedText type="title" style={styles.title}>
              {TEXT.auth.registerTitle}
            </ThemedText>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              {TEXT.auth.registerSubtitle}
            </ThemedText>
          </View>

          <View style={styles.form}>
            {error ? (
              <View style={[styles.errorContainer, { backgroundColor: theme.expense + "20" }]}>
                <Feather name="alert-circle" size={16} color={theme.expense} />
                <ThemedText type="caption" style={{ color: theme.expense, flex: 1 }}>
                  {error}
                </ThemedText>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                Nome
              </ThemedText>
              <View style={[styles.inputContainer, { backgroundColor: theme.backgroundDefault }]}>
                <Feather name="user" size={20} color={theme.textSecondary} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Seu nome"
                  placeholderTextColor={theme.textSecondary}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                Email
              </ThemedText>
              <View style={[styles.inputContainer, { backgroundColor: theme.backgroundDefault }]}>
                <Feather name="mail" size={20} color={theme.textSecondary} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="seu@email.com"
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
                Senha
              </ThemedText>
              <View style={[styles.inputContainer, { backgroundColor: theme.backgroundDefault }]}>
                <Feather name="lock" size={20} color={theme.textSecondary} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Minimo 6 caracteres"
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

            <View style={styles.inputGroup}>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                Confirmar Senha
              </ThemedText>
              <View style={[styles.inputContainer, { backgroundColor: theme.backgroundDefault }]}>
                <Feather name="lock" size={20} color={theme.textSecondary} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Repita a senha"
                  placeholderTextColor={theme.textSecondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.registerButton,
                {
                  backgroundColor: theme.primary,
                  opacity: pressed || isLoading ? 0.8 : 1,
                },
              ]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText type="body" style={{ color: "#FFFFFF", fontWeight: "600" }}>
                  Criar Conta
                </ThemedText>
              )}
            </Pressable>
          </View>

          <View style={styles.footer}>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              Ja tem uma conta?
            </ThemedText>
            <Pressable onPress={onLogin}>
              <ThemedText type="body" style={{ color: theme.primary, fontWeight: "600" }}>
                {" "}Fazer login
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
    padding: Spacing.md,
    borderRadius: BorderRadius.xs,
    gap: Spacing.sm,
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
  registerButton: {
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
