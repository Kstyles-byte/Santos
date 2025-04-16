'use client';

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native-web';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

export default function EntryForm() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    // Basic validation
    if (!fullName.trim()) {
      alert('Please enter your full name');
      return;
    }

    if (!phoneNumber.trim()) {
      alert('Please enter your phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          phoneNumber,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFullName('');
        setPhoneNumber('');
      } else {
        throw new Error(result.error || 'Failed to submit entry');
      }
    } catch (error) {
      console.error('Error submitting entry:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {!submitted ? (
        <>
          <View style={styles.titleContainer}>
            <ThemedText variant="heading" style={styles.title}>SANTOS EVENT DRAW</ThemedText>
            <View style={styles.titleUnderline} />
          </View>
          <ThemedText style={styles.subtitle}>Enter for a chance to win</ThemedText>

          <View style={styles.form}>
            <ThemedText style={styles.label}>FULL NAME</ThemedText>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="#666"
            />

            <ThemedText style={styles.label}>PHONE NUMBER</ThemedText>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter your phone number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <ThemedText style={styles.buttonText}>
                {isSubmitting ? 'SUBMITTING...' : 'ENTER DRAW'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.successContainer}>
          <View style={styles.celebrationIcon}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0a7ea4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12L11 15L16 9" stroke="#0a7ea4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </View>
          
          <View style={styles.titleContainer}>
            <ThemedText variant="heading" style={styles.successTitle}>ENTRY CONFIRMED</ThemedText>
            <View style={[styles.titleUnderline, styles.successUnderline]} />
          </View>
          
          <ThemedText style={styles.successText}>
            Thank you for participating in the Santos exclusive event draw. 
            Your entry has been successfully registered.
          </ThemedText>
          
          <View style={styles.infoContainer}>
            <ThemedText style={styles.infoText}>
              Winners will be announced at the end of the event. If selected, 
              you'll be contacted via the phone number you provided.
            </ThemedText>
          </View>
          
          <TouchableOpacity
            style={[styles.button, styles.homeButton]}
            onPress={() => setSubmitted(false)}
          >
            <ThemedText style={styles.buttonText}>GO BACK TO HOME</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  titleContainer: {
    position: 'relative',
    marginBottom: 10,
    paddingBottom: 15,
  },
  title: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 4,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  titleUnderline: {
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
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
    color: Colors.dark.icon,
    letterSpacing: 1,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#9BA1A6',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 0,
    marginBottom: 25,
    paddingHorizontal: 15,
    color: Colors.dark.text,
    backgroundColor: '#1A1A1A',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 0,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 500,
    padding: 20,
  },
  celebrationIcon: {
    marginBottom: 30,
    marginTop: 10,
  },
  successTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 3,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#ffffff',
  },
  successUnderline: {
    backgroundImage: 'linear-gradient(90deg, transparent, #0a7ea4, transparent)',
    width: '100%',
  },
  successText: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 1.5,
    letterSpacing: 0.5,
    color: '#ffffff',
  },
  infoContainer: {
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    borderLeft: '3px solid #0a7ea4',
    padding: 20,
    marginBottom: 40,
    borderRadius: 0,
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    lineHeight: 1.6,
    color: '#9BA1A6',
    letterSpacing: 0.5,
  },
  homeButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0a7ea4',
    transition: 'all 0.3s ease',
  },
}); 