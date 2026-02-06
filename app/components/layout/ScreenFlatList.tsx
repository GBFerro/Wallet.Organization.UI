import { Spacing } from "@constants/theme";
import { useScreenInsets } from "@hooks/useScreenInsets";
import { useTheme } from "@hooks/useTheme";
import React from "react";
import { FlatList, FlatListProps, StyleSheet } from "react-native";

export function ScreenFlatList<T>({
	contentContainerStyle,
	style,
	...flatListProps
}: Readonly<FlatListProps<T>>) {
	const { theme } = useTheme();
	const { paddingTop, paddingBottom, scrollInsetBottom } = useScreenInsets();

	return (
		<FlatList
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
			{...flatListProps}
		/>
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
