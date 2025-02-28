import { StyleSheet, Platform } from 'react-native';

import { ThemedView } from './ThemedView';

export function ScreenHeader() {
  return (<ThemedView style={styles.topPadding}></ThemedView>)
}

const styles = StyleSheet.create({
  topPadding: {
    height: Platform.OS === 'ios' ? 80 : 20,
  },
});