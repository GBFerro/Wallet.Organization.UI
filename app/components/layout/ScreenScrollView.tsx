import { Spacing } from "@constants/theme";
import { useScreenInsets } from "@hooks/useScreenInsets";
import { useTheme } from "@hooks/useTheme";
import { ScrollView, ScrollViewProps, StyleSheet } from "react-native";

export function ScreenScrollView({
	children,
	contentContainerStyle,
	style,
	...scrollViewProps
}: Readonly<ScrollViewProps>) {
	const { theme } = useTheme();
	const { paddingTop, paddingBottom, scrollInsetBottom } = useScreenInsets();

	return (
		<ScrollView
			style={[
				styles.container,
				{ backgroundColor: theme.backgroundRoot },
				style,
			]}
			contentContainerStyle={[
				{
					paddingTop,
					paddingBottom,
				},
				styles.contentContainer,
				contentContainerStyle,
			]}
			scrollIndicatorInsets={{ bottom: scrollInsetBottom }}
			{...scrollViewProps}
		>
			{children}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		paddingHorizontal: Spacing.xl,
	},
});
