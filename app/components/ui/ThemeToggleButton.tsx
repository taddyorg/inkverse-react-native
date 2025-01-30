import * as React from 'react';
import { useColorScheme } from 'react-native';
import { Appearance, TouchableOpacity, StyleSheet } from 'react-native';

import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';

export function ThemeToggleButton() {
  const colorScheme = useColorScheme() ?? 'light';

  const toggleTheme = React.useCallback(() => {
      const newColorScheme = colorScheme === 'light' ? 'dark' : 'light';
      Appearance.setColorScheme(newColorScheme);
  }, [colorScheme]);

  const buttonTextColor = colorScheme === 'light' ? '#fff' : '#000';

  return (
      <TouchableOpacity 
        onPress={toggleTheme}
        style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]}>
        <ThemedText style={[styles.buttonText, { color: buttonTextColor }]}>
            Switch to {colorScheme === 'light' ? 'Dark' : 'Light'} Mode
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