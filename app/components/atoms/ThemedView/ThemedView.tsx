import { useTheme } from "@hooks/useTheme";
import { cn } from "@utils/cn";
import { View, type ViewProps } from "react-native";

export interface ThemedViewProps extends ViewProps {
	lightColor?: string;
	darkColor?: string;
	className?: string;
}

export function ThemedView({
	lightColor,
	darkColor,
	className,
	style,
	...otherProps
}: Readonly<ThemedViewProps>) {
	const { theme, isDark } = useTheme();

	const backgroundColor =
		isDark && darkColor
			? darkColor
			: !isDark && lightColor
				? lightColor
				: theme.backgroundRoot;

	return (
		<View
			{...otherProps}
			className={cn(className)}
			style={[{ backgroundColor }, style]}
		/>
	);
}
