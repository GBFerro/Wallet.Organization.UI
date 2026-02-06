import { TransactionsScreen } from "@feature/transactions/TransactionsScreen";
import { useTheme } from "@hooks/useTheme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getCommonScreenOptions } from "./screenOptions";

export type TransactionsStackParamList = {
	Transactions: undefined;
};

const Stack = createNativeStackNavigator<TransactionsStackParamList>();

export default function TransactionsStackNavigator() {
	const { theme, isDark } = useTheme();

	return (
		<Stack.Navigator
			id="TransactionsScreen"
			screenOptions={{
				...getCommonScreenOptions({ theme, isDark }),
			}}
		>
			<Stack.Screen
				name="Transactions"
				component={TransactionsScreen}
				options={{
					headerTitle: "Transacoes",
				}}
			/>
		</Stack.Navigator>
	);
}
