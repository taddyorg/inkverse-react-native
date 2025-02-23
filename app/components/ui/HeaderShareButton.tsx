import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PressableOpacity } from './PressableOpacity';

interface HeaderShareButtonProps {
  onPress?: () => void;
}

export function HeaderShareButton({ onPress }: HeaderShareButtonProps) {
  return (
    <PressableOpacity 
      style={styles.shareButton} 
      onPress={onPress}>
      <Ionicons name="share-outline" size={24} color="black" />
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  shareButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
}); 