import { TransactionEnum } from "@constants/api";
import { TransactionsScreen } from "@feature/transactions/TransactionsScreen";
import { useTheme } from "@hooks/useTheme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useMemo } from "react";
import { getCommonScreenOptions } from "./screenOptions";

export type TransactionsStackParamList = {
	Transactions: undefined;
};

const Stack = createNativeStackNavigator<TransactionsStackParamList>();

interface TransactionsStackNavigatorProps {
	name: string;
	headerTitle: string;
	type: TransactionEnum;
}

export default function TransactionsStackNavigator({
	name,
	headerTitle,
	type,
}: Readonly<TransactionsStackNavigatorProps>) {
	const { theme, isDark } = useTheme();

	const TransactionsRoute = useMemo(
		() =>
			function TransactionsRoute() {
				return <TransactionsScreen type={type} />;
			},
		[type],
	);

	return (
		<Stack.Navigator
			id={undefined}
			screenOptions={{
				...getCommonScreenOptions({ theme, isDark }),
			}}
		>
			<Stack.Screen
				name={name as keyof TransactionsStackParamList}
				component={TransactionsRoute}
				options={{
					headerTitle,
				}}
			/>
		</Stack.Navigator>
	);
}
