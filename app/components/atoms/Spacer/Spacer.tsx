import { cn } from "@utils/cn";
import type { ViewProps } from "react-native";
import { View } from "react-native";

export interface SpacerProps extends ViewProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Spacer({
  width = 1,
  height = 1,
  className,
  ...props
}: Readonly<SpacerProps>) {
  return (
    <View
      {...props}
      className={cn(className)}
      style={{
        width,
        height,
      }}
    />
  );
}
