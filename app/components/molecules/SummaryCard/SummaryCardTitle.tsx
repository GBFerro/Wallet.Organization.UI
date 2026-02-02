import { ThemedText } from "@components/atoms/ThemedText";
import { cn } from "@utils/cn";
import React from "react";
import type { TextProps } from "react-native";
import { useSummaryCardContext } from "./SummaryCardContext";

export interface SummaryCardTitleProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

export function SummaryCardTitle({
  children,
  className,
  style,
  ...props
}: Readonly<SummaryCardTitleProps>) {
  const { theme } = useSummaryCardContext();

  return (
    <ThemedText
      {...props}
      type="caption"
      className={cn(className)}
      style={[{ color: theme.textSecondary }, style]}
    >
      {children}
    </ThemedText>
  );
}
