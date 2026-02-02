import { cn } from "@utils/cn";
import React from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";

export interface CardHeaderProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({
  children,
  className,
  ...props
}: Readonly<CardHeaderProps>) {
  return (
    <View {...props} className={cn("mb-4", className)}>
      {children}
    </View>
  );
}
