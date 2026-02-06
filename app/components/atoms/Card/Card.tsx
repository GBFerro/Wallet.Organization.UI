import { useTheme } from "@hooks/useTheme";
import { cn } from "@utils/cn";
import React, { useMemo } from "react";
import type { ViewProps } from "react-native";
import { Pressable } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { CardContext } from "./CardContext";
import { getBackgroundColorForElevation, springConfig } from "./utils";

export interface CardProps extends ViewProps {
	elevation?: number;
	onPress?: () => void;
	children: React.ReactNode;
	className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({
	elevation = 1,
	onPress,
	children,
	className,
	style,
	...props
}: Readonly<CardProps>) {
	const { theme } = useTheme();
	const scale = useSharedValue(1);

	const cardBackgroundColor = getBackgroundColorForElevation(elevation, theme);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	const handlePressIn = () => {
		if (onPress) {
			scale.value = withSpring(0.98, springConfig);
		}
	};

	const handlePressOut = () => {
		if (onPress) {
			scale.value = withSpring(1, springConfig);
		}
	};

	const contextValue = useMemo(
		() => ({ elevation, theme }),
		[elevation, theme],
	);

	const Component = onPress ? AnimatedPressable : Animated.View;
	const pressProps = onPress
		? { onPress, onPressIn: handlePressIn, onPressOut: handlePressOut }
		: {};

	return (
		<CardContext.Provider value={contextValue}>
			<Component
				{...props}
				{...pressProps}
				className={cn("rounded-3xl p-6", className)}
				style={[
					{
						backgroundColor: cardBackgroundColor,
					},
					onPress && animatedStyle,
					style,
				]}
			>
				{children}
			</Component>
		</CardContext.Provider>
	);
}
