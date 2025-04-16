declare module 'react-native-web' {
  export * from 'react-native';
  
  // Additional React Native Web specific types can be added here
  export interface ViewProps {
    style?: any;
    [key: string]: any;
  }
  
  export interface TextProps {
    style?: any;
    [key: string]: any;
  }
  
  export interface TextInputProps {
    style?: any;
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    placeholderTextColor?: string;
    secureTextEntry?: boolean;
    keyboardType?: string;
    [key: string]: any;
  }
  
  export interface TouchableOpacityProps {
    style?: any;
    onPress?: () => void;
    disabled?: boolean;
    [key: string]: any;
  }
  
  export interface ScrollViewProps {
    style?: any;
    [key: string]: any;
  }
  
  export interface StyleSheetStatic {
    create<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(styles: T): T;
    flatten(style?: any): any;
    hairlineWidth: number;
    absoluteFill: any;
    absoluteFillObject: any;
  }
  
  export const StyleSheet: StyleSheetStatic;
  export const View: React.ComponentType<ViewProps>;
  export const Text: React.ComponentType<TextProps>;
  export const TextInput: React.ComponentType<TextInputProps>;
  export const TouchableOpacity: React.ComponentType<TouchableOpacityProps>;
  export const ScrollView: React.ComponentType<ScrollViewProps>;
} 