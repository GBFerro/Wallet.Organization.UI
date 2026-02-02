import { cn } from "@utils/cn";
import React from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";

export interface CardBodyProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({
  children,
  className,
  ...props
}: Readonly<CardBodyProps>) {
  return (
    <View {...props} className={cn("flex-1", className)}>
      {children}
    </View>
  );
}
