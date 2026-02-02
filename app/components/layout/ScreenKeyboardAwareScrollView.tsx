import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

import { Spacing } from "@constants/theme";
import { useTheme } from "@hooks/useTheme";
import { ScreenScrollView } from "./ScreenScrollView";

interface ScreenKeyboardAwareScrollViewProps {
  children: React.ReactNode;
  contentContainerStyle?: any;
  style?: any;
  keyboardShouldPersistTaps?: "always" | "never" | "handled";
}

export function ScreenKeyboardAwareScrollView({
  children,
  contentContainerStyle,
  style,
  keyboardShouldPersistTaps = "handled",
}: Readonly<ScreenKeyboardAwareScrollViewProps>) {
  const { theme } = useTheme();

  /**
   * KeyboardAvoidingView with ScrollView for keyboard handling.
   * Web doesn't need keyboard avoidance, so falls back to ScreenScrollView.
   */
  if (Platform.OS === "web") {
    return (
      <ScreenScrollView
        style={style}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      >
        {children}
      </ScreenScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenScrollView
        style={style}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      >
        {children}
      </ScreenScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.xl,
  },
});
