import { ThemedText } from "@components/atoms/ThemedText";
import { useTheme } from "@hooks/useTheme";
import { cn } from "@utils/cn";
import type { ReactNode } from "react";
import type { PressableProps } from "react-native";
import { Pressable } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	type WithSpringConfig,
	withSpring,
} from "react-native-reanimated";

export interface ButtonProps extends Omit<PressableProps, "children"> {
	onPress?: () => void;
	children: ReactNode;
	className?: string;
	disabled?: boolean;
}

const springConfig: WithSpringConfig = {
	damping: 15,
	mass: 0.3,
	stiffness: 150,
	overshootClamping: true,
	energyThreshold: 0.001,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
	onPress,
	children,
	className,
	disabled = false,
	...props
}: Readonly<ButtonProps>) {
	const { theme } = useTheme();
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	const handlePressIn = () => {
		if (!disabled) {
			scale.value = withSpring(0.98, springConfig);
		}
	};

	const handlePressOut = () => {
		if (!disabled) {
			scale.value = withSpring(1, springConfig);
		}
	};

	return (
		<AnimatedPressable
			{...props}
			onPress={disabled ? undefined : onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			disabled={disabled}
			className={cn("h-12 rounded-full items-center justify-center", className)}
			style={[
				{
					backgroundColor: theme.link,
					opacity: disabled ? 0.5 : 1,
				},
				animatedStyle,
			]}
		>
			<ThemedText
				type="body"
				className="font-semibold"
				style={{ color: theme.buttonText }}
			>
				{children}
			</ThemedText>
		</AnimatedPressable>
	);
}
