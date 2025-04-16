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
        <View style={styles.logoUnderline} />
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
    position: 'relative',
    paddingBottom: 8,
  },
  logo: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 3,
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  logoUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: 'transparent',
    backgroundImage: 'linear-gradient(90deg, transparent, #0a7ea4, transparent)',
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
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  activeLink: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
}); 