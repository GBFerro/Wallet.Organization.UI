import { HeaderTitle } from "@components/molecules";
import { ForecastScreen } from "@feature/forecast/ForecastScreen";
import { useTheme } from "@hooks/useTheme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { getCommonScreenOptions } from "./screenOptions";

export type ForecastStackParamList = {
  Forecast: undefined;
};

const Stack = createNativeStackNavigator<ForecastStackParamList>();

function ForecastHeaderTitle() {
  return <HeaderTitle title="FinForecast" />;
}

export default function ForecastStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      id="ForecastScreen"
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Forecast"
        component={ForecastScreen}
        options={{
          headerTitle: ForecastHeaderTitle,
        }}
      />
    </Stack.Navigator>
  );
}
