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
          <ThemedText variant="heading" style={styles.title}>SANTOS EVENT DRAW</ThemedText>
          <ThemedText style={styles.subtitle}>Enter for a chance to win</ThemedText>

          <View style={styles.form}>
            <ThemedText>Full Name</ThemedText>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="#666"
            />

            <ThemedText>Phone Number</ThemedText>
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
                {isSubmitting ? 'Submitting...' : 'ENTER DRAW'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.successContainer}>
          <ThemedText variant="heading" style={styles.successTitle}>ENTRY SUBMITTED!</ThemedText>
          <ThemedText style={styles.successText}>
            Thank you for entering the Santos event draw.
          </ThemedText>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setSubmitted(false)}
          >
            <ThemedText style={styles.buttonText}>ENTER AGAIN</ThemedText>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    color: Colors.dark.icon,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: Colors.dark.text,
    backgroundColor: '#222',
  },
  button: {
    backgroundColor: Colors.dark.tint,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  successText: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
}); 