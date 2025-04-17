'use client';

import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native-web';
import { Colors } from '@/constants/Colors';

interface ThemedSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  trackColor?: {
    false: string;
    true: string;
  };
  thumbColor?: string;
  style?: any;
  disabled?: boolean;
}

export function ThemedSwitch({ 
  value, 
  onValueChange, 
  trackColor = { 
    false: '#333', 
    true: Colors.dark.tint 
  }, 
  thumbColor = '#fff',
  style,
  disabled = false
}: ThemedSwitchProps) {
  const handleToggle = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.7}
      onPress={handleToggle}
      style={[
        styles.container,
        {
          backgroundColor: value ? trackColor.true : trackColor.false,
          opacity: disabled ? 0.5 : 1,
        },
        style
      ]}
    >
      <View
        style={[
          styles.thumb,
          {
            backgroundColor: thumbColor,
            transform: [{ translateX: value ? 18 : 0 }],
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    transition: 'transform 0.2s ease',
  },
}); 