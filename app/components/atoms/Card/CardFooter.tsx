import { cn } from "@utils/cn";
import React from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";

export interface CardFooterProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({
  children,
  className,
  ...props
}: Readonly<CardFooterProps>) {
  return (
    <View {...props} className={cn("mt-4", className)}>
      {children}
    </View>
  );
}
