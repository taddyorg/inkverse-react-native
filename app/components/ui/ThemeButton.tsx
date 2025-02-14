import * as React from 'react';
import { useColorScheme } from 'react-native';
import { Appearance, TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';

import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';

type ThemeButtonProps = TouchableOpacityProps & {
  buttonText: string;
}

export function ThemeButton({ buttonText, ...rest }: ThemeButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const buttonTextColor = colorScheme === 'light' ? '#fff' : '#000';

  return (
      <TouchableOpacity
        {...rest}
        style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]}>
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
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
  },
  icon: {
    marginRight: 4
  }
}); 