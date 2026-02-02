import { ThemedText } from "@components/atoms";
import { ScreenScrollView } from "@components/layout";
import { BorderRadius, Spacing } from "@constants/theme";
import { useAuth } from "@contexts/AuthContext";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import React from "react";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";


interface SettingsItemProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  danger?: boolean;
}

function SettingsItem({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  danger = false,
}: SettingsItemProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.settingsItem,
        { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: danger ? theme.error : theme.primary },
        ]}
      >
        <Feather name={icon} size={18} color="#FFFFFF" />
      </View>
      <View style={styles.settingsContent}>
        <ThemedText
          type="body"
          style={[danger && { color: theme.error }]}
        >
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText
            type="caption"
            style={{ color: theme.textSecondary }}
          >
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {showChevron ? (
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      ) : null}
    </Pressable>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      <ThemedText
        type="caption"
        style={[styles.sectionTitle, { color: theme.textSecondary }]}
      >
        {title}
      </ThemedText>
      <View
        style={[
          styles.sectionContent,
          { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

export function SettingsScreen() {
  const { theme, isDark } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    const performLogout = async () => {
      await logout();
    };

    if (Platform.OS === "web") {
      if (globalThis.confirm("Deseja sair da sua conta?")) {
        performLogout();
      }
    } else {
      Alert.alert("Sair", "Deseja sair da sua conta?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: performLogout },
      ]);
    }
  };

  const handleDeleteAccount = () => {
    const performDelete = () => {
      console.log("Delete account");
    };

    if (Platform.OS === "web") {
      if (
        window.confirm(
          "Tem certeza que deseja excluir sua conta? Esta acao nao pode ser desfeita."
        )
      ) {
        performDelete();
      }
    } else {
      Alert.alert(
        "Excluir Conta",
        "Tem certeza que deseja excluir sua conta? Esta acao nao pode ser desfeita.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Excluir", style: "destructive", onPress: performDelete },
        ]
      );
    }
  };

  return (
    <ScreenScrollView>
      <View style={styles.profileSection}>
        <View
          style={[styles.avatar, { backgroundColor: theme.backgroundSecondary }]}
        >
          <Feather name="user" size={32} color={theme.textSecondary} />
        </View>
        <ThemedText type="label">{user?.name || "Usuario"}</ThemedText>
        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
          {user?.email || "usuario@email.com"}
        </ThemedText>
      </View>

      <SettingsSection title="CONTA">
        <SettingsItem
          icon="user"
          title="Perfil"
          subtitle="Editar informacoes pessoais"
          onPress={() => {}}
        />
        <View style={[styles.separator, { backgroundColor: theme.border }]} />
        <SettingsItem
          icon="bell"
          title="Notificacoes"
          subtitle="Configurar alertas"
          onPress={() => {}}
        />
        <View style={[styles.separator, { backgroundColor: theme.border }]} />
        <SettingsItem
          icon="lock"
          title="Seguranca"
          subtitle="Senha e autenticacao"
          onPress={() => {}}
        />
      </SettingsSection>

      <SettingsSection title="PREFERENCIAS">
        <SettingsItem
          icon="dollar-sign"
          title="Moeda"
          subtitle="BRL - Real Brasileiro"
          onPress={() => {}}
        />
        <View style={[styles.separator, { backgroundColor: theme.border }]} />
        <SettingsItem
          icon={isDark ? "moon" : "sun"}
          title="Aparencia"
          subtitle={isDark ? "Modo Escuro" : "Modo Claro"}
          onPress={() => {}}
        />
        <View style={[styles.separator, { backgroundColor: theme.border }]} />
        <SettingsItem
          icon="globe"
          title="Idioma"
          subtitle="Portugues (Brasil)"
          onPress={() => {}}
        />
      </SettingsSection>

      <SettingsSection title="SUPORTE">
        <SettingsItem
          icon="help-circle"
          title="Ajuda"
          subtitle="Perguntas frequentes"
          onPress={() => {}}
        />
        <View style={[styles.separator, { backgroundColor: theme.border }]} />
        <SettingsItem
          icon="mail"
          title="Contato"
          subtitle="Fale conosco"
          onPress={() => {}}
        />
        <View style={[styles.separator, { backgroundColor: theme.border }]} />
        <SettingsItem
          icon="file-text"
          title="Termos de Uso"
          onPress={() => {}}
        />
        <View style={[styles.separator, { backgroundColor: theme.border }]} />
        <SettingsItem
          icon="shield"
          title="Politica de Privacidade"
          onPress={() => {}}
        />
      </SettingsSection>

      <SettingsSection title="SESSAO">
        <SettingsItem
          icon="log-out"
          title="Sair"
          onPress={handleLogout}
          showChevron={false}
        />
        <View style={[styles.separator, { backgroundColor: theme.border }]} />
        <SettingsItem
          icon="trash-2"
          title="Excluir Conta"
          onPress={handleDeleteAccount}
          showChevron={false}
          danger
        />
      </SettingsSection>

      <View style={styles.footer}>
        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
          FinForecast v1.0.0
        </ThemedText>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    gap: Spacing.xs,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsContent: {
    flex: 1,
  },
  separator: {
    height: 1,
    marginLeft: 60,
  },
  footer: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
});
