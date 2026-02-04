import { ThemedText } from "@components/atoms";
import { Spacing } from "@constants/theme";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import React from "react";
import { Pressable, StyleSheet, Switch, View } from "react-native";

interface SettingsItemProps {
	icon: keyof typeof Feather.glyphMap;
	title: string;
	subtitle?: string;
	onPress?: () => void;
	showChevron?: boolean;
	danger?: boolean;
	showSwitch?: boolean;
	switchValue?: boolean;
	onSwitchChange?: (value: boolean) => void;
}

export function SettingsItem({
	icon,
	title,
	subtitle,
	onPress,
	showChevron = true,
	danger = false,
	showSwitch = false,
	switchValue = false,
	onSwitchChange,
}: Readonly<SettingsItemProps>) {
	const { theme } = useTheme();

	const renderElement = () => {
		if (showSwitch) {
			return (
				<Switch
					value={switchValue}
					onValueChange={onSwitchChange}
					trackColor={{ false: theme.border, true: theme.primary }}
					thumbColor="#FFFFFF"
					ios_backgroundColor={theme.border}
				/>
			);
		}
		if (showChevron) {
			return (
				<Feather name="chevron-right" size={20} color={theme.textSecondary} />
			);
		}
		return null;
	};

	return (
		<Pressable
			style={({ pressed }) => [
				styles.settingsItem,
				{
					backgroundColor: theme.backgroundDefault,
					opacity: pressed ? 0.7 : 1,
				},
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
				<ThemedText type="body" style={[danger && { color: theme.error }]}>
					{title}
				</ThemedText>
				{subtitle ? (
					<ThemedText type="caption" style={{ color: theme.textSecondary }}>
						{subtitle}
					</ThemedText>
				) : null}
			</View>

			{renderElement()}
		</Pressable>
	);
}

const styles = StyleSheet.create({
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
});
