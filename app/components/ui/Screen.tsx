import { View, SafeAreaView, type ViewProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ColorCategory } from '@/constants/Colors';

export type ScreenProps = ViewProps & {
  passedInLightColor?: string;
  passedInDarkColor?: string;
  ignoreSafeArea?: boolean;
};

export function Screen({ style, passedInLightColor, passedInDarkColor, ignoreSafeArea = false, ...otherProps }: ScreenProps) {
  const backgroundColor = useThemeColor({ light: passedInLightColor, dark: passedInDarkColor }, ColorCategory.Background);

  const content = (
    <View style={[{ backgroundColor }, styles.container, style]} {...otherProps} />
  );

  return ignoreSafeArea ? content : <SafeAreaView style={styles.safeArea}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
