import { ThemedText } from "@components/atoms/ThemedText";
import { cn } from "@utils/cn";
import React from "react";
import type { TextProps } from "react-native";

export interface CardDescriptionProps extends TextProps {
	children: React.ReactNode;
	className?: string;
}

export function CardDescription({
	children,
	className,
	...props
}: Readonly<CardDescriptionProps>) {
	return (
		<ThemedText
			{...props}
			type="caption"
			className={cn("opacity-70", className)}
		>
			{children}
		</ThemedText>
	);
}
