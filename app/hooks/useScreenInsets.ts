import { Spacing } from "@constants/theme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useScreenInsets() {
	const insets = useSafeAreaInsets();
	const tabBarHeight = useBottomTabBarHeight();

	return {
		paddingTop: Spacing.xl,
		paddingBottom: tabBarHeight + Spacing.xl,
		scrollInsetBottom: insets.bottom + 16,
	};
}
