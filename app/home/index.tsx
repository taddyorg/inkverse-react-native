import * as React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/app/components/ui/ThemedText';
import { ThemedView } from '@/app/components/ui/ThemedView';

export function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Home Screen</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20
  },
}); 