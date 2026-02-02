import { Feather } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import ForecastStackNavigator from "./ForecastStackNavigator";
import SettingsStackNavigator from "./SettingsStackNavigator";
import TransactionsStackNavigator from "./TransactionsStackNavigator";


export type MainTabParamList = {
  ForecastTab: undefined;
  TransactionsTab: undefined;
  SettingsTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabIconProps {
  color: string;
  size: number;
}

function ForecastTabIcon({ color, size }: Readonly<TabIconProps>) {
  return <Feather name="trending-up" size={size} color={color} />;
}

function TransactionsTabIcon({ color, size }: Readonly<TabIconProps>) {
  return <Feather name="list" size={size} color={color} />;
}

function SettingsTabIcon({ color, size }: Readonly<TabIconProps>) {
  return <Feather name="settings" size={size} color={color} />;
}

interface TabBarBackgroundProps {
  isDark: boolean;
}

function TabBarBackground({ isDark }: Readonly<TabBarBackgroundProps>) {
  if (Platform.OS !== "ios") {
    return null;
  }

  return (
    <BlurView
      intensity={100}
      tint={isDark ? "dark" : "light"}
      style={StyleSheet.absoluteFill}
    />
  );
}

function createTabBarBackground(isDark: boolean) {
  return () => <TabBarBackground isDark={isDark} />;
}

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      id="1"
      initialRouteName="ForecastTab"
      screenOptions={{
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.select({
            ios: "transparent",
            android: theme.backgroundRoot,
          }),
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: createTabBarBackground(isDark),
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="ForecastTab"
        component={ForecastStackNavigator}
        options={{
          title: "Previsao",
          tabBarIcon: ForecastTabIcon,
        }}
      />
      <Tab.Screen
        name="TransactionsTab"
        component={TransactionsStackNavigator}
        options={{
          title: "Transacoes",
          tabBarIcon: TransactionsTabIcon,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={{
          title: "Ajustes",
          tabBarIcon: SettingsTabIcon,
        }}
      />
    </Tab.Navigator>
  );
}
