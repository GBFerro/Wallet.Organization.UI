import { useTheme } from "@hooks/useTheme";
import { cn } from "@utils/cn";
import React, { useMemo } from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";
import { SummaryCardContext } from "./SummaryCardContext";

export interface SummaryCardProps extends ViewProps {
	children: React.ReactNode;
	className?: string;
}

export function SummaryCard({
	children,
	className,
	style,
	...props
}: Readonly<SummaryCardProps>) {
	const { theme } = useTheme();

	const contextValue = useMemo(() => ({ theme }), [theme]);

	return (
		<SummaryCardContext.Provider value={contextValue}>
			<View
				{...props}
				className={cn("w-40 p-4 rounded gap-1", className)}
				style={[{ backgroundColor: theme.backgroundDefault }, style]}
			>
				{children}
			</View>
		</SummaryCardContext.Provider>
	);
}
