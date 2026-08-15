import { TransactionEnum } from "@constants/api";
import { TEXT } from "@constants/text";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
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

function ForecastTabStack() {
	return <ForecastStackNavigator headerTitle={TEXT.header.forecast} />;
}

function ExpensesTabStack() {
	return (
		<TransactionsStackNavigator
			name="ExpensesScreen"
			headerTitle={TEXT.header.transactions.expenses}
			type={TransactionEnum.Expense}
		/>
	);
}

function IncomesTabStack() {
	return (
		<TransactionsStackNavigator
			name="IncomesScreen"
			headerTitle={TEXT.header.transactions.incomes}
			type={TransactionEnum.Income}
		/>
	);
}

function SettingsTabStack() {
	return <SettingsStackNavigator headerTitle={TEXT.header.settings} />;
}

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

function createTabBarBackground(backgroundColor: string) {
	return function TabBarBackground() {
		return <View style={[StyleSheet.absoluteFill, { backgroundColor }]} />;
	};
}

export default function MainTabNavigator() {
	const { theme } = useTheme();

	return (
		<Tab.Navigator
			id={undefined}
			initialRouteName="ForecastTab"
			screenOptions={{
				tabBarActiveTintColor: theme.tabIconSelected,
				tabBarInactiveTintColor: theme.tabIconDefault,
				tabBarStyle: {
					position: "absolute",
					backgroundColor: theme.backgroundRoot,
					borderTopWidth: 0,
					elevation: 0,
				},
				tabBarBackground: createTabBarBackground(theme.backgroundRoot),
				headerShown: false,
			}}
		>
			<Tab.Screen
				name="ForecastTab"
				component={ForecastTabStack}
				options={{
					title: TEXT.nav.forecast,
					tabBarIcon: ForecastTabIcon,
				}}
			/>
			<Tab.Screen
				name="ExpensesTab"
				component={ExpensesTabStack}
				options={{
					title: TEXT.nav.transactions.expenses,
					tabBarIcon: ExpensesTabIcon,
				}}
			/>
			<Tab.Screen
				name="IncomesTab"
				component={IncomesTabStack}
				options={{
					title: TEXT.nav.transactions.incomes,
					tabBarIcon: IncomesTabIcon,
				}}
			/>
			<Tab.Screen
				name="SettingsTab"
				component={SettingsTabStack}
				options={{
					title: TEXT.nav.settings,
					tabBarIcon: SettingsTabIcon,
				}}
			/>
		</Tab.Navigator>
	);
}
