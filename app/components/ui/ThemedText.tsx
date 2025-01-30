import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ColorCategory } from '@/constants/Colors';

enum TextStyle {
  default = 'default',
  title = 'title',
  defaultSemiBold = 'defaultSemiBold',
  subtitle = 'subtitle',
}

export type ThemedTextProps = TextProps & {
  passedInLightColor?: string;
  passedInDarkColor?: string;
  type?: TextStyle;
};

export function ThemedText({
  style,
  passedInLightColor,
  passedInDarkColor,
  type = TextStyle.default,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: passedInLightColor, dark: passedInDarkColor }, ColorCategory.Text);

  return (
    <Text
      style={[
        { color },
        styles[type],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
