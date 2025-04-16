import { View, ViewProps } from 'react-native-web';
import { Colors } from '@/constants/Colors';

export function ThemedView(props: ViewProps) {
  return (
    <View
      {...props}
      style={[{ backgroundColor: Colors.dark.background }, props.style]}
    />
  );
} 