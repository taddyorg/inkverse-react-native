import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ColorCategory } from '@/constants/Colors';

export enum ThemedTextSize {
  default = 'default',
  title = 'title',
  subtitle = 'subtitle',
}

export enum ThemedTextFont {
  regular = 'SourceSans3-Regular',
  semiBold = 'SourceSans3-SemiBold',
  bold = 'SourceSans3-Bold',
}

export type ThemedTextProps = TextProps & {
  passedInLightColor?: string;
  passedInDarkColor?: string;
  size?: ThemedTextSize;
  font?: ThemedTextFont;
};

export function ThemedText({
  style,
  passedInLightColor,
  passedInDarkColor,
  size = ThemedTextSize.default,
  font = ThemedTextFont.regular,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: passedInLightColor, dark: passedInDarkColor }, ColorCategory.Text);

  return (
    <Text
      style={[
        { color },
        { fontFamily: font },
        styles[size],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    fontFamily: ThemedTextFont.regular,
  },
  title: {
    fontSize: 28,
    fontFamily: ThemedTextFont.bold,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: ThemedTextFont.semiBold,
  },
});