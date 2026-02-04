import { SettingsItem, SettingsSection, ThemedText } from "@components/atoms";
import { ScreenScrollView } from "@components/layout";
import { TEXT } from "@constants/text";
import { BorderRadius, Spacing } from "@constants/theme";
import { useAuth } from "@contexts/AuthContext";
import { useToast } from "@contexts/ToastContext";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import React from "react";
import { StyleSheet, View } from "react-native";

export function SettingsScreen() {
	const { theme, isDark, setThemeMode } = useTheme();
	const { showToast } = useToast();
	const { user, logout } = useAuth();

	const handleThemeToggle = (value: boolean) => {
		setThemeMode(value ? "dark" : "light");
	};

	const handleLogout = async () => {
		await logout();
	};

	return (
		<ScreenScrollView>
			<View style={styles.profileSection}>
				<View
					style={[
						styles.avatar,
						{ backgroundColor: theme.backgroundSecondary },
					]}
				>
					<Feather name="user" size={32} color={theme.textSecondary} />
				</View>
				<ThemedText type="label">
					{user?.name || TEXT.settings.defaultUser}
				</ThemedText>
				<ThemedText type="caption" style={{ color: theme.textSecondary }}>
					{user?.email || TEXT.settings.defaultEmail}
				</ThemedText>
			</View>

			<SettingsSection title={TEXT.settings.sectionAccount}>
				<SettingsItem
					icon="user"
					title={TEXT.settings.profile}
					subtitle={TEXT.settings.profileSubtitle}
					onPress={() =>
						showToast({
							title: "Not Implemented",
							description: "In development",
							type: "info",
							duration: 2000,
						})
					}
				/>
				<View style={[styles.separator, { backgroundColor: theme.border }]} />
				<SettingsItem
					icon="bell"
					title={TEXT.settings.notifications}
					subtitle={TEXT.settings.notificationsSubtitle}
					onPress={() =>
						showToast({
							title: "Not Implemented",
							description: "In development",
							type: "info",
							duration: 2000,
						})
					}
				/>
				<View style={[styles.separator, { backgroundColor: theme.border }]} />
				<SettingsItem
					icon="lock"
					title={TEXT.settings.security}
					subtitle={TEXT.settings.securitySubtitle}
					onPress={() =>
						showToast({
							title: "Not Implemented",
							description: "In development",
							type: "info",
							duration: 2000,
						})
					}
				/>
			</SettingsSection>

			<SettingsSection title={TEXT.settings.sectionPreferences}>
				<SettingsItem
					icon="dollar-sign"
					title={TEXT.settings.currency}
					subtitle={TEXT.settings.currencySubtitle}
					onPress={() =>
						showToast({
							title: "Not Implemented",
							description: "In development",
							type: "info",
							duration: 2000,
						})
					}
				/>
				<View style={[styles.separator, { backgroundColor: theme.border }]} />
				<SettingsItem
					icon={isDark ? "moon" : "sun"}
					title={TEXT.settings.darkMode}
					subtitle={
						isDark ? TEXT.settings.darkModeOn : TEXT.settings.darkModeOff
					}
					showSwitch
					switchValue={isDark}
					onSwitchChange={handleThemeToggle}
				/>
				<View style={[styles.separator, { backgroundColor: theme.border }]} />
				<SettingsItem
					icon="globe"
					title={TEXT.settings.language}
					subtitle={TEXT.settings.languageSubtitle}
					onPress={() =>
						showToast({
							title: "Not Implemented",
							description: "In development",
							type: "info",
							duration: 2000,
						})
					}
				/>
			</SettingsSection>

			<SettingsSection title={TEXT.settings.sectionSession}>
				<SettingsItem
					icon="log-out"
					title={TEXT.settings.logout}
					onPress={handleLogout}
					showChevron={false}
				/>
				<View style={[styles.separator, { backgroundColor: theme.border }]} />
			</SettingsSection>

			<View style={styles.footer}>
				<ThemedText type="caption" style={{ color: theme.textSecondary }}>
					{TEXT.appVersion}
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
