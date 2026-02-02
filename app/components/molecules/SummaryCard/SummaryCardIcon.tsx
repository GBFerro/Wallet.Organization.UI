import { Feather } from "@expo/vector-icons";
import { cn } from "@utils/cn";
import React, { useMemo } from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";

export interface SummaryCardIconProps extends ViewProps {
  name: keyof typeof Feather.glyphMap;
  color: string;
  size?: number;
  className?: string;
}

export function SummaryCardIcon({
  name,
  color,
  size = 20,
  className,
  style,
  ...props
}: Readonly<SummaryCardIconProps>) {
  const iconBackgroundColor = useMemo(() => color + "20", [color]);

  return (
    <View
      {...props}
      className={cn("w-10 h-10 rounded-full items-center justify-center mb-1", className)}
      style={[
        { backgroundColor: iconBackgroundColor },
        style,
      ]}
    >
      <Feather name={name} size={size} color={color} />
    </View>
  );
}
