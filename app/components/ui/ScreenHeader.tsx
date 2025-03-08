import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from './ThemedView';

type ScreenHeaderProps = {
  additionalTopPadding?: number;
}

export function ScreenHeader({ additionalTopPadding = 15 }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <ThemedView style={[{ paddingTop: insets.top + additionalTopPadding }]}/>
  );
};