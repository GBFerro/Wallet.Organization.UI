import { ThemedText, ThemedView } from "@components/atoms";
import { Spacing } from "@constants/theme";
import { useTheme } from "@hooks/useTheme";
import { cn } from "@utils/cn";
import React from "react";
import type { ViewProps } from "react-native";
import { ActivityIndicator, StyleSheet } from "react-native";

export interface LoadingStateProps extends ViewProps {
  message?: string;
  size?: "small" | "large";
  className?: string;
}

export function LoadingState({
  message = "Carregando...",
  size = "large",
  className,
  style,
  ...props
}: Readonly<LoadingStateProps>) {
  const { theme } = useTheme();

  return (
    <ThemedView
      {...props}
      className={cn(className)}
      style={[styles.container, style]}
    >
      <ActivityIndicator size={size} color={theme.primary} />
      {message && (
        <ThemedText
          type="body"
          style={{ marginTop: Spacing.lg, color: theme.textSecondary }}
        >
          {message}
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
