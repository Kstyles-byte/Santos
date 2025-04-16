'use client';

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native-web';
import { usePathname, useRouter } from 'next/navigation';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.logoContainer}
        onPress={() => router.push('/')}
      >
        <ThemedText style={styles.logo}>SANTOS</ThemedText>
      </TouchableOpacity>

      <View style={styles.links}>
        <TouchableOpacity
          style={styles.link}
          onPress={() => router.push('/')}
        >
          <ThemedText
            style={[
              styles.linkText,
              pathname === '/' && styles.activeLink,
            ]}
          >
            Enter Draw
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => router.push('/admin')}
        >
          <ThemedText
            style={[
              styles.linkText,
              pathname === '/admin' && styles.activeLink,
            ]}
          >
            Admin
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  logoContainer: {
    marginRight: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.tint,
  },
  links: {
    flexDirection: 'row',
  },
  link: {
    marginLeft: 20,
  },
  linkText: {
    fontSize: 16,
    color: '#ccc',
  },
  activeLink: {
    color: Colors.dark.tint,
    fontWeight: 'bold',
  },
}); 