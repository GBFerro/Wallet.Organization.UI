import { TransactionEnum } from "@constants/api";
import { TEXT } from "@constants/text";
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
	ExpensesTab: undefined;
	IncomesTab: undefined;
	SettingsTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabIconProps {
	color: string;
	size: number;
}

function ForecastTabIcon({ color, size }: Readonly<TabIconProps>) {
	return <Feather name="pie-chart" size={size} color={color} />;
}

function ExpensesTabIcon({ color, size }: Readonly<TabIconProps>) {
	return <Feather name="credit-card" size={size} color={color} />;
}

function IncomesTabIcon({ color, size }: Readonly<TabIconProps>) {
	return <Feather name="dollar-sign" size={size} color={color} />;
}

function SettingsTabIcon({ color, size }: Readonly<TabIconProps>) {
	return <Feather name="settings" size={size} color={color} />;
}

interface TabBarBackgroundProps {
	isDark: boolean;
}

function TabBarBackground({ isDark }: Readonly<TabBarBackgroundProps>) {
	return (
		<BlurView
			intensity={70}
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
				component={() =>
					ForecastStackNavigator({ headerTitle: TEXT.header.forecast })
				}
				options={{
					title: TEXT.nav.forecast,
					tabBarIcon: ForecastTabIcon,
				}}
			/>
			<Tab.Screen
				name="ExpensesTab"
				component={() =>
					TransactionsStackNavigator({
						name: "ExpensesScreen",
						headerTitle: TEXT.header.transactions.expenses,
						type: TransactionEnum.Expense,
					})
				}
				options={{
					title: TEXT.nav.transactions.expenses,
					tabBarIcon: ExpensesTabIcon,
				}}
			/>
			<Tab.Screen
				name="IncomesTab"
				component={() =>
					TransactionsStackNavigator({
						name: "IncomesScreen",
						headerTitle: TEXT.header.transactions.incomes,
						type: TransactionEnum.Income,
					})
				}
				options={{
					title: TEXT.nav.transactions.incomes,
					tabBarIcon: IncomesTabIcon,
				}}
			/>
			<Tab.Screen
				name="SettingsTab"
				component={() =>
					SettingsStackNavigator({
						headerTitle: TEXT.header.settings,
					})
				}
				options={{
					title: TEXT.nav.settings,
					tabBarIcon: SettingsTabIcon,
				}}
			/>
		</Tab.Navigator>
	);
}
