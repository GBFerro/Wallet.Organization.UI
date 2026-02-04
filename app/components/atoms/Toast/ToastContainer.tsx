import { Spacing } from "@constants/theme";
import { useToast } from "@contexts/ToastContext";
import { cn } from "@utils/cn";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { Toast } from "./Toast";

export interface ToastContainerProps extends Omit<ViewProps, "style"> {
	className?: string;
}

export function ToastContainer({
	className,
	...props
}: Readonly<ToastContainerProps>) {
	const { toasts, hideToast } = useToast();

	if (toasts.length === 0) return null;

	return (
		<View
			{...props}
			style={[styles.container]}
			className={cn(className)}
			pointerEvents="box-none"
		>
			{toasts.map((toast, index) => {
				const reverseIndex = toasts.length - 1 - index;
				const offset = reverseIndex * 8;
				const scale = 1 - reverseIndex * 0.05;
				const zIndex = toasts.length + index;

				return (
					<View
						key={toast.id}
						style={[
							styles.toastWrapper,
							{
								transform: [{ translateY: offset }, { scale }],
								zIndex,
								opacity: 1 - reverseIndex * 0.15,
							},
						]}
						pointerEvents={index === toasts.length - 1 ? "auto" : "none"}
					>
						<Toast toast={toast} onDismiss={hideToast} />
					</View>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		left: 0,
		right: 0,
		zIndex: 999999,
	},
	toastWrapper: {
		position: "fixed",
		bottom: Spacing.fabSize,
		left: 0,
		right: 0,
	},
});
