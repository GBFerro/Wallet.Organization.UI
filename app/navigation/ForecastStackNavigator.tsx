import { ForecastScreen } from "@feature/forecast/ForecastScreen";
import { useTheme } from "@hooks/useTheme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { getCommonScreenOptions } from "./screenOptions";

export type ForecastStackParamList = {
	Forecast: undefined;
};

const Stack = createNativeStackNavigator<ForecastStackParamList>();

export default function ForecastStackNavigator({
	headerTitle,
}: Readonly<{ headerTitle: string }>) {
	const { theme, isDark } = useTheme();

	return (
		<Stack.Navigator
			id={undefined}
			screenOptions={{
				...getCommonScreenOptions({ theme, isDark }),
			}}
		>
			<Stack.Screen
				name="Forecast"
				component={ForecastScreen}
				options={{
					headerTitle,
				}}
			/>
		</Stack.Navigator>
	);
}
