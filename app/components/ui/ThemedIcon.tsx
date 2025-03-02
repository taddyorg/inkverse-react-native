import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { useThemeColor, ColorCategory } from '@/constants/Colors';

export enum ThemedIconSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

export type ThemedIconProps = {
  children: ReactNode;
  passedInLightColor?: string;
  passedInDarkColor?: string;
  size?: ThemedIconSize;
  style?: ViewStyle;
};

interface IconSizeStyle {
  container: ViewStyle;
  size: number;
}

export function ThemedIcon({
  children,
  passedInLightColor,
  passedInDarkColor,
  size = ThemedIconSize.medium,
  style,
}: ThemedIconProps) {
  const color = useThemeColor(
    { light: passedInLightColor, dark: passedInDarkColor },
    ColorCategory.Text
  );

  // Clone the child element and pass the color prop
  const iconWithColor = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        color,
        size: styles[size].size,
        ...child.props,
      });
    }
    return child;
  });

  return <View style={[styles[size].container, style]}>{iconWithColor}</View>;
}

const styles: Record<ThemedIconSize, IconSizeStyle> = {
  [ThemedIconSize.small]: {
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    size: 16,
  },
  [ThemedIconSize.medium]: {
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    size: 24,
  },
  [ThemedIconSize.large]: {
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    size: 32,
  },
}; 