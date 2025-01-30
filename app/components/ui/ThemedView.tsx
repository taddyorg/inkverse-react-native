import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ColorCategory } from '@/constants/Colors';

export type ThemedViewProps = ViewProps & {
  passedInLightColor?: string;
  passedInDarkColor?: string;
};

export function ThemedView({ style, passedInLightColor, passedInDarkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: passedInLightColor, dark: passedInDarkColor }, ColorCategory.Background);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}