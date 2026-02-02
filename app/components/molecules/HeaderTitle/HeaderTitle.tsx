import { ThemedText } from "@components/atoms/ThemedText";
import { cn } from "@utils/cn";
import React from "react";
import type { ImageProps, ViewProps } from "react-native";
import { Image, View } from "react-native";

export interface HeaderTitleProps extends ViewProps {
  title: string;
  icon?: ImageProps["source"];
  className?: string;
}

export function HeaderTitle({
  title,
  icon,
  className,
  ...props
}: Readonly<HeaderTitleProps>) {
  return (
    <View {...props} className={cn("flex-row items-center justify-start", className)}>
      {icon && (
        <Image
          source={icon}
          className="w-7 h-7 mr-2 rounded"
          resizeMode="contain"
        />
      )}
      <ThemedText className="text-base font-semibold">{title}</ThemedText>
    </View>
  );
}
