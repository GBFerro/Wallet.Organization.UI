import { TransactionEnum } from "@constants/api";
import { TransactionsScreen } from "@feature/transactions/TransactionsScreen";
import { useTheme } from "@hooks/useTheme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getCommonScreenOptions } from "./screenOptions";

export type TransactionsStackParamList = {
	Transactions: undefined;
};

const Stack = createNativeStackNavigator<TransactionsStackParamList>();

export default function TransactionsStackNavigator({
	name,
	headerTitle,
	type,
}: Readonly<{
	name: any;
	headerTitle: string;
	type: TransactionEnum;
}>) {
	const { theme, isDark } = useTheme();

	return (
		<Stack.Navigator
			id={name}
			screenOptions={{
				...getCommonScreenOptions({ theme, isDark }),
			}}
		>
			<Stack.Screen
				name={name}
				component={() => TransactionsScreen({ type })}
				options={{
					headerTitle,
				}}
			/>
		</Stack.Navigator>
	);
}
