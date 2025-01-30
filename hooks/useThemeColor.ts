/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useMemo } from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;
type ThemeProps = { light?: string; dark?: string };

export function useThemeColor(props: ThemeProps, colorName: ColorName) {
  const theme = useColorScheme() ?? 'light';
  
  return useMemo(() => {
    const colorPassedInFromProps = props[theme];
    return colorPassedInFromProps || Colors[theme][colorName];
  }, [props, theme, colorName]);
}