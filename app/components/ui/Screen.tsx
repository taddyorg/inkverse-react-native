import { View, type ViewProps, StyleSheet } from 'react-native';

import { ColorCategory, useThemeColor } from '@/constants/Colors';

export type ScreenProps = ViewProps & {
  passedInLightColor?: string;
  passedInDarkColor?: string;
};

export function Screen({ style, passedInLightColor, passedInDarkColor, ...otherProps }: ScreenProps) {
  const backgroundColor = useThemeColor({ light: passedInLightColor, dark: passedInDarkColor }, ColorCategory.Background);

  return <View style={[{ backgroundColor }, styles.container, style]} {...otherProps} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});