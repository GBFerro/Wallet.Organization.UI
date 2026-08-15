import { useState } from "react";
import type { GestureResponderEvent } from "react-native";

interface PressedHandlers {
	onPressIn: (event: GestureResponderEvent) => void;
	onPressOut: (event: GestureResponderEvent) => void;
}

export function usePressed(handlers?: Partial<PressedHandlers>) {
	const [pressed, setPressed] = useState(false);

	const pressHandlers: PressedHandlers = {
		onPressIn: (event) => {
			setPressed(true);
			handlers?.onPressIn?.(event);
		},
		onPressOut: (event) => {
			setPressed(false);
			handlers?.onPressOut?.(event);
		},
	};

	return { pressed, pressHandlers };
}
