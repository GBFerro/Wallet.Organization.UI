import { ThemedText } from "@components/atoms/ThemedText";
import { cn } from "@utils/cn";
import React from "react";
import type { TextProps } from "react-native";

export interface CardTitleProps extends TextProps {
	children: React.ReactNode;
	className?: string;
}

export function CardTitle({
	children,
	className,
	...props
}: Readonly<CardTitleProps>) {
	return (
		<ThemedText {...props} type="label" className={cn("mb-2", className)}>
			{children}
		</ThemedText>
	);
}
