import { Text, TextProps } from 'react-native-web';
import { Colors } from '@/constants/Colors';

type ThemedTextProps = TextProps & {
  variant?: 'heading' | 'subheading' | 'body' | 'caption';
};

export function ThemedText(props: ThemedTextProps) {
  const { variant = 'body', style, ...otherProps } = props;
  
  // Define text styles based on variant
  const variantStyles = {
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subheading: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    body: {
      fontSize: 16,
    },
    caption: {
      fontSize: 14,
      color: Colors.dark.icon,
    },
  };

  return (
    <Text
      {...otherProps}
      style={[
        { color: Colors.dark.text },
        variantStyles[variant as keyof typeof variantStyles],
        style,
      ]}
    />
  );
} 