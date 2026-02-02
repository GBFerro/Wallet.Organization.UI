import React, { createContext, useContext, useMemo } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { ThemedText } from "@components/atoms/ThemedText";
import { BorderRadius, Spacing } from "@constants/theme";
import { useTheme } from "@hooks/useTheme";

interface CardProps {
  elevation?: number;
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardContextValue {
  elevation: number;
  theme: ReturnType<typeof useTheme>["theme"];
}

const CardContext = createContext<CardContextValue | null>(null);

const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("Card compound components must be used within Card");
  }
  return context;
};

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
  energyThreshold: 0.001,
};

const getBackgroundColorForElevation = (
  elevation: number,
  theme: ReturnType<typeof useTheme>["theme"],
): string => {
  switch (elevation) {
    case 1:
      return theme.backgroundDefault;
    case 2:
      return theme.backgroundSecondary;
    case 3:
      return theme.backgroundTertiary;
    default:
      return theme.backgroundRoot;
  }
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function CardRoot({
  elevation = 1,
  onPress,
  children,
  style,
}: Readonly<CardProps>) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const cardBackgroundColor = getBackgroundColorForElevation(elevation, theme);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, springConfig);
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, springConfig);
    }
  };

  const contextValue: CardContextValue = useMemo(
    () => ({ elevation, theme }),
    [elevation, theme]
  );

  const Component = onPress ? AnimatedPressable : Animated.View;
  const pressProps = onPress
    ? { onPress, onPressIn: handlePressIn, onPressOut: handlePressOut }
    : {};

  return (
    <CardContext.Provider value={contextValue}>
      <Component
        {...pressProps}
        style={[
          styles.card,
          {
            backgroundColor: cardBackgroundColor,
          },
          onPress && animatedStyle,
          style,
        ]}
      >
        {children}
      </Component>
    </CardContext.Provider>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function CardHeader({ children, style }: Readonly<CardHeaderProps>) {
  return <View style={[styles.header, style]}>{children}</View>;
}

interface CardBodyProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function CardBody({ children, style }: Readonly<CardBodyProps>) {
  return <View style={[styles.body, style]}>{children}</View>;
}

interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function CardFooter({ children, style }: Readonly<CardFooterProps>) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

interface CardTitleProps {
  children: React.ReactNode;
  style?: import('react-native').TextStyle;
}

function CardTitle({ children, style }: Readonly<CardTitleProps>) {
  return (
    <ThemedText type="label" style={[styles.title, style]}>
      {children}
    </ThemedText>
  );
}

interface CardDescriptionProps {
  children: React.ReactNode;
  style?: import('react-native').TextStyle;
}

function CardDescription({ children, style }: Readonly<CardDescriptionProps>) {
  return (
    <ThemedText type="caption" style={[styles.description, style]}>
      {children}
    </ThemedText>
  );
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Title: CardTitle,
  Description: CardDescription,
});

const styles = StyleSheet.create({
  card: {
    padding: Spacing.xl,
    borderRadius: BorderRadius["2xl"],
  },
  header: {
    marginBottom: Spacing.md,
  },
  body: {
    flex: 1,
  },
  footer: {
    marginTop: Spacing.md,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  description: {
    opacity: 0.7,
  },
});
