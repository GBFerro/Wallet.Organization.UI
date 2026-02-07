import { SettingsScreen } from "@feature/settings/SettingsScreen";
import { useTheme } from "@hooks/useTheme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { getCommonScreenOptions } from "./screenOptions";

export type SettingsStackParamList = {
	Settings: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStackNavigator({ headerTitle }) {
	const { theme, isDark } = useTheme();

	return (
		<Stack.Navigator
			id="SettingsScreen"
			screenOptions={{
				...getCommonScreenOptions({ theme, isDark }),
			}}
		>
			<Stack.Screen
				name="Settings"
				component={SettingsScreen}
				options={{
					headerTitle,
				}}
			/>
		</Stack.Navigator>
	);
}
