import * as React from 'react';
import { useColorScheme } from 'react-native';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';

import { ThemedText, ThemedTextFont } from './ThemedText';
import { Colors } from '@/constants/Colors';

type ThemeButtonProps = TouchableOpacityProps & {
  buttonText: string;
}

export function ThemeButton({ buttonText, onPress, style, ...props }: ThemeButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';

  const backgroundColor = colorScheme === 'light' ? Colors.light.tint : Colors.dark.tint;
  const buttonTextColor = colorScheme === 'light' ? Colors.dark.text : Colors.light.text;

  return (
      <TouchableOpacity 
        onPress={onPress}
        style={[styles.button, { backgroundColor }, style]}>
        <ThemedText style={[styles.buttonText, { color: buttonTextColor }]}>
            {buttonText}
        </ThemedText>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 100,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: ThemedTextFont.semiBold,
  },
  icon: {
    marginRight: 4
  }
}); 