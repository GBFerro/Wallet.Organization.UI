import { ThemedText } from "@components/atoms/ThemedText";
import { cn } from "@utils/cn";
import React from "react";
import type { TextProps } from "react-native";

export interface SummaryCardValueProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

export function SummaryCardValue({
  children,
  numberOfLines = 1,
  className,
  ...props
}: Readonly<SummaryCardValueProps>) {
  return (
    <ThemedText
      {...props}
      type="label"
      numberOfLines={numberOfLines}
      className={cn(className)}
    >
      {children}
    </ThemedText>
  );
}
