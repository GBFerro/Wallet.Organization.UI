import type { WithSpringConfig } from "react-native-reanimated";

export const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
  energyThreshold: 0.001,
};

export function getBackgroundColorForElevation(
  elevation: number,
  theme: {
    backgroundRoot: string;
    backgroundDefault: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
  },
): string {
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
}
