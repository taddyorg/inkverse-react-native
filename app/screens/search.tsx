import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import { Screen } from '@/app/components/ui';

export function SearchScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.content}>
          
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 