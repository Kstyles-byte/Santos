// Utility functions for managing offline storage in React Native

// Keys for AsyncStorage
export const STORAGE_KEYS = {
  PENDING_ENTRIES: 'santos_pending_entries',
  CURRENT_EVENT: 'santos_current_event',
  ADMIN_TOKEN: 'santos_admin_token',
};

// Type for a pending entry
export interface PendingEntry {
  fullName: string;
  phoneNumber: string;
  eventId?: number;
  timestamp: string; // ISO date string
  id: string; // Local temporary ID
}

// In React Native app, you would use AsyncStorage like this:
/*
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save a pending entry when offline
export async function savePendingEntry(entry: Omit<PendingEntry, 'id' | 'timestamp'>): Promise<string> {
  try {
    // Get existing pending entries
    const existingEntriesJson = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_ENTRIES);
    const existingEntries: PendingEntry[] = existingEntriesJson ? JSON.parse(existingEntriesJson) : [];
    
    // Create new entry with temporary ID and timestamp
    const newEntry: PendingEntry = {
      ...entry,
      id: `pending_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    
    // Add to pending entries
    const updatedEntries = [...existingEntries, newEntry];
    await AsyncStorage.setItem(STORAGE_KEYS.PENDING_ENTRIES, JSON.stringify(updatedEntries));
    
    return newEntry.id;
  } catch (error) {
    console.error('Error saving pending entry:', error);
    throw error;
  }
}

// Get all pending entries
export async function getPendingEntries(): Promise<PendingEntry[]> {
  try {
    const entriesJson = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_ENTRIES);
    return entriesJson ? JSON.parse(entriesJson) : [];
  } catch (error) {
    console.error('Error getting pending entries:', error);
    return [];
  }
}

// Submit pending entries when back online
export async function submitPendingEntries(apiUrl: string): Promise<{success: PendingEntry[], failed: PendingEntry[]}> {
  try {
    const pendingEntries = await getPendingEntries();
    const results = { success: [], failed: [] };
    
    if (pendingEntries.length === 0) {
      return results;
    }
    
    // Process each entry
    for (const entry of pendingEntries) {
      try {
        const response = await fetch(`${apiUrl}/api/entries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: entry.fullName,
            phoneNumber: entry.phoneNumber,
            eventId: entry.eventId
          }),
        });
        
        if (response.ok) {
          results.success.push(entry);
        } else {
          results.failed.push(entry);
        }
      } catch (error) {
        results.failed.push(entry);
      }
    }
    
    // Remove successful entries from storage
    if (results.success.length > 0) {
      const remainingEntries = pendingEntries.filter(
        entry => !results.success.some(successEntry => successEntry.id === entry.id)
      );
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_ENTRIES, JSON.stringify(remainingEntries));
    }
    
    return results;
  } catch (error) {
    console.error('Error submitting pending entries:', error);
    throw error;
  }
}

// Clear all pending entries
export async function clearPendingEntries(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_ENTRIES);
  } catch (error) {
    console.error('Error clearing pending entries:', error);
    throw error;
  }
}
*/

// These functions will be implemented in the React Native client
// This file serves as a reference for how offline storage should be implemented 