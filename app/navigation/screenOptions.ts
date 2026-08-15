import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

interface ScreenOptionsParams {
	theme: {
		backgroundRoot: string;
		text: string;
	};
	isDark: boolean;
	transparent?: boolean;
}

export const getCommonScreenOptions = ({
	theme,
}: ScreenOptionsParams): NativeStackNavigationOptions => ({
	headerTitleAlign: "center",
	headerTransparent: false,
	headerTintColor: theme.text,
	headerStyle: {
		backgroundColor: theme.backgroundRoot,
	},
	gestureEnabled: true,
	gestureDirection: "horizontal",
	fullScreenGestureEnabled: true,
	contentStyle: {
		backgroundColor: theme.backgroundRoot,
	},
});
