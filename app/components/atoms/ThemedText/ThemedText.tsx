import { Typography } from "@constants/theme";
import { useTheme } from "@hooks/useTheme";
import { cn } from "@utils/cn";
import { Text, type TextProps } from "react-native";

export type ThemedTextType = "title" | "heading" | "subheading" | "label" | "body" | "caption" | "link";

export interface ThemedTextProps extends TextProps {
  lightColor?: string;
  darkColor?: string;
  type?: ThemedTextType;
  className?: string;
}

export function ThemedText({
  lightColor,
  darkColor,
  type = "body",
  className,
  style,
  ...rest
}: Readonly<ThemedTextProps>) {
  const { theme, isDark } = useTheme();

  const getColor = () => {
    if (isDark && darkColor) {
      return darkColor;
    }

    if (!isDark && lightColor) {
      return lightColor;
    }

    if (type === "link") {
      return theme.link;
    }

    return theme.text;
  };

  const getTypeStyle = () => {
    switch (type) {
      case "title":
        return Typography.title;
      case "heading":
        return Typography.heading;
      case "subheading":
        return Typography.subheading;
      case "label":
        return Typography.label;
      case "body":
        return Typography.body;
      case "caption":
        return Typography.caption;
      case "link":
        return Typography.link;
      default:
        return Typography.body;
    }
  };

  return (
    <Text
      {...rest}
      className={cn(className)}
      style={[{ color: getColor() }, getTypeStyle(), style]} />)
}
