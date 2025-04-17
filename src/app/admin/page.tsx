'use client';

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native-web';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedSwitch } from '@/components/ThemedSwitch';
import { Colors } from '@/constants/Colors';

interface Entry {
  id: number;
  fullName: string;
  phoneNumber: string;
  timestamp: string;
  isWinner: boolean;
  drawTimestamp: string | null;
}

// Add the SiteStatus interface
interface SiteStatus {
  id: number;
  isLocked: boolean;
  message: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [winner, setWinner] = useState<Entry | null>(null);
  const [showWinnerAnimation, setShowWinnerAnimation] = useState(false);
  
  // Add these new state variables
  const [siteStatus, setSiteStatus] = useState<SiteStatus | null>(null);
  const [siteLockMessage, setSiteLockMessage] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [includingWinners, setIncludingWinners] = useState(false);

  // Login function
  const handleLogin = async () => {
    if (!token.trim()) {
      setError('Please enter your admin token');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/entries', {
        headers: {
          'x-admin-token': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries);
        setIsAuthenticated(true);
        // Save token to session storage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('adminToken', token);
        }
      } else {
        setError('Invalid token or server error');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load entries
  const fetchEntries = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/entries', {
        headers: {
          'x-admin-token': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries);
      } else {
        throw new Error('Failed to fetch entries');
      }
    } catch (err) {
      console.error('Error fetching entries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Draw winner
  const handleDrawWinner = async () => {
    setIsLoading(true);
    setShowWinnerAnimation(true);
    
    // Wait for animation to start
    setTimeout(async () => {
      try {
        const response = await fetch('/api/draw-winner', {
          method: 'POST',
          headers: {
            'x-admin-token': token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTimeout(() => {
            setWinner(data.winner);
            setIsLoading(false);
            // Refresh the entries list
            fetchEntries();
          }, 2000); // Delay winner reveal for animation
        } else {
          throw new Error('Failed to draw winner');
        }
      } catch (err) {
        console.error('Error drawing winner:', err);
        setIsLoading(false);
        setShowWinnerAnimation(false);
      }
    }, 500);
  };

  // Export entries
  const handleExport = async (format: 'json' | 'csv') => {
    try {
      // For CSV, we need to download the file
      window.open(`/api/export?format=${format}&token=${encodeURIComponent(token)}`, '_blank');
    } catch (err) {
      console.error('Error exporting entries:', err);
    }
  };

  // Add fetchSiteStatus function
  const fetchSiteStatus = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await fetch('/api/site-status');
      const data = await response.json();
      
      if (response.ok && data.status) {
        setSiteStatus(data.status);
        setSiteLockMessage(data.status.message);
      }
    } catch (err) {
      console.error('Error fetching site status:', err);
    }
  };
  
  // Add toggleSiteLock function
  const toggleSiteLock = async () => {
    if (!isAuthenticated || !siteStatus) return;
    
    setIsLoading(true);
    try {
      const newLockStatus = !siteStatus.isLocked;
      
      const response = await fetch('/api/site-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify({
          isLocked: newLockStatus,
          message: siteLockMessage,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSiteStatus(data.status);
        alert(`Site is now ${newLockStatus ? 'locked' : 'unlocked'}`);
      } else {
        throw new Error('Failed to update site status');
      }
    } catch (err) {
      console.error('Error updating site lock status:', err);
      alert('Failed to update site lock status');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add handleClearEntries function
  const handleClearEntries = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/clear-entries?clearWinners=${includingWinners}`, {
        method: 'POST',
        headers: {
          'x-admin-token': token,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        // Refresh entries list
        fetchEntries();
      } else {
        throw new Error('Failed to clear entries');
      }
    } catch (err) {
      console.error('Error clearing entries:', err);
      alert('Failed to clear entries');
    } finally {
      setIsLoading(false);
      setShowClearConfirm(false);
    }
  };

  // Check for saved token on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = sessionStorage.getItem('adminToken');
      if (savedToken) {
        setToken(savedToken);
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Fetch entries when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchEntries();
      fetchSiteStatus();
    }
  }, [isAuthenticated]);

  // Reset winner animation when winner is null
  useEffect(() => {
    if (!winner) {
      setShowWinnerAnimation(false);
    }
  }, [winner]);

  if (!isAuthenticated) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText variant="heading">Admin Login</ThemedText>
        
        <View style={styles.form}>
          <ThemedText>Admin Token</ThemedText>
          <TextInput
            style={styles.input}
            value={token}
            onChangeText={setToken}
            placeholder="Enter your admin token"
            placeholderTextColor="#666"
            secureTextEntry
          />
          
          {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <ThemedText style={styles.buttonText}>
              {isLoading ? 'Logging in...' : 'LOGIN'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="heading">Santos Event Draw Admin</ThemedText>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            setIsAuthenticated(false);
            setToken('');
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('adminToken');
            }
          }}
        >
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Add site lock controls */}
      <View style={styles.siteControls}>
        <View style={styles.siteLockControl}>
          <ThemedText style={styles.controlLabel}>Site Lock Status:</ThemedText>
          <View style={styles.switchContainer}>
            <ThemedText style={styles.switchLabel}>
              {siteStatus?.isLocked ? 'Locked' : 'Open'}
            </ThemedText>
            <ThemedSwitch
              value={siteStatus?.isLocked || false}
              onValueChange={toggleSiteLock}
              trackColor={{ false: '#333', true: '#0a7ea4' }}
              thumbColor="#fff"
              style={styles.switch}
              disabled={isLoading}
            />
          </View>
        </View>
        
        {siteStatus?.isLocked && (
          <View style={styles.messageControl}>
            <ThemedText style={styles.controlLabel}>Lock Message:</ThemedText>
            <TextInput
              style={styles.messageInput}
              value={siteLockMessage}
              onChangeText={setSiteLockMessage}
              placeholder="Message to display when site is locked"
              placeholderTextColor="#666"
              multiline
            />
            <TouchableOpacity
              style={[styles.button, styles.updateButton]}
              onPress={async () => {
                if (!isAuthenticated || !siteStatus) return;
                
                try {
                  const response = await fetch('/api/site-status', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-admin-token': token,
                    },
                    body: JSON.stringify({
                      message: siteLockMessage,
                    }),
                  });
                  
                  if (response.ok) {
                    const data = await response.json();
                    setSiteStatus(data.status);
                    alert('Message updated');
                  }
                } catch (err) {
                  console.error('Error updating lock message:', err);
                }
              }}
            >
              <ThemedText style={styles.buttonText}>Update Message</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.drawButton}
          onPress={handleDrawWinner}
          disabled={isLoading || entries.length === 0}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading && showWinnerAnimation ? 'Drawing...' : 'DRAW WINNER'}
          </ThemedText>
        </TouchableOpacity>
        
        <View style={styles.exportButtons}>
          <TouchableOpacity
            style={[styles.button, styles.exportButton]}
            onPress={() => handleExport('csv')}
          >
            <ThemedText style={styles.buttonText}>Export CSV</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.exportButton]}
            onPress={() => handleExport('json')}
          >
            <ThemedText style={styles.buttonText}>Export JSON</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add clear entries button */}
      <View style={styles.clearControl}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => setShowClearConfirm(true)}
          disabled={isLoading || entries.length === 0}
        >
          <ThemedText style={styles.buttonText}>
            CLEAR ENTRIES
          </ThemedText>
        </TouchableOpacity>
      </View>

      {winner && (
        <View style={styles.winnerContainer}>
          <ThemedText variant="heading" style={styles.winnerTitle}>WINNER!</ThemedText>
          <ThemedText variant="subheading" style={styles.winnerName}>{winner.fullName}</ThemedText>
          <ThemedText>Phone: {winner.phoneNumber}</ThemedText>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setWinner(null)}
          >
            <ThemedText style={styles.buttonText}>Close</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {isLoading && showWinnerAnimation && !winner ? (
        <View style={styles.animationContainer}>
          <ThemedText variant="heading">Drawing a winner...</ThemedText>
          {/* You could add a more complex animation here */}
        </View>
      ) : null}

      {/* Add confirmation dialog for clearing entries */}
      {showClearConfirm && (
        <View style={styles.confirmContainer}>
          <ThemedText variant="heading" style={styles.confirmTitle}>Confirm Clear</ThemedText>
          <ThemedText style={styles.confirmText}>
            Are you sure you want to clear entries? This cannot be undone.
          </ThemedText>
          
          <View style={styles.includeWinnersRow}>
            <ThemedText>Include winners?</ThemedText>
            <ThemedSwitch
              value={includingWinners}
              onValueChange={setIncludingWinners}
              trackColor={{ false: '#333', true: '#e74c3c' }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.confirmButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowClearConfirm(false)}
            >
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleClearEntries}
            >
              <ThemedText style={styles.buttonText}>Confirm Clear</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.entriesContainer}>
        <ThemedText variant="subheading">
          {entries.length} Total Entries
        </ThemedText>
        
        {entries.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <ThemedText style={[styles.tableHeaderCell, styles.idColumn]}>ID</ThemedText>
              <ThemedText style={[styles.tableHeaderCell, styles.nameColumn]}>Name</ThemedText>
              <ThemedText style={[styles.tableHeaderCell, styles.phoneColumn]}>Phone</ThemedText>
              <ThemedText style={[styles.tableHeaderCell, styles.statusColumn]}>Status</ThemedText>
            </View>
            
            {entries.map((entry) => (
              <View key={entry.id} style={styles.tableRow}>
                <ThemedText style={[styles.tableCell, styles.idColumn]}>{entry.id}</ThemedText>
                <ThemedText style={[styles.tableCell, styles.nameColumn]}>{entry.fullName}</ThemedText>
                <ThemedText style={[styles.tableCell, styles.phoneColumn]}>{entry.phoneNumber}</ThemedText>
                <ThemedText style={[styles.tableCell, styles.statusColumn, entry.isWinner && styles.winnerText]}>
                  {entry.isWinner ? 'WINNER' : 'Entered'}
                </ThemedText>
              </View>
            ))}
          </View>
        ) : (
          <ThemedText style={styles.emptyText}>No entries yet.</ThemedText>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    minHeight: '100vh',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
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
  errorText: {
    color: '#ff6b6b',
    marginBottom: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  exportButtons: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: Colors.dark.tint,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    minWidth: 120,
  },
  drawButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    minWidth: 150,
  },
  exportButton: {
    marginLeft: 10,
    backgroundColor: '#3498db',
  },
  logoutButton: {
    padding: 10,
  },
  logoutText: {
    color: Colors.dark.tint,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  entriesContainer: {
    flex: 1,
    marginTop: 20,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#333',
    paddingBottom: 10,
    marginBottom: 5,
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    color: Colors.dark.tint,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#222',
    paddingVertical: 10,
  },
  tableCell: {
    paddingRight: 10,
  },
  idColumn: {
    width: '10%',
  },
  nameColumn: {
    width: '40%',
  },
  phoneColumn: {
    width: '30%',
  },
  statusColumn: {
    width: '20%',
  },
  winnerText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: Colors.dark.icon,
  },
  winnerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -100 }],
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 20,
    borderRadius: 10,
    zIndex: 10,
    alignItems: 'center',
    width: 300,
    borderWidth: 2,
    borderColor: Colors.dark.tint,
  },
  winnerTitle: {
    color: '#e74c3c',
    marginBottom: 10,
  },
  winnerName: {
    marginBottom: 5,
  },
  animationContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -50 }],
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 20,
    borderRadius: 10,
    zIndex: 10,
    alignItems: 'center',
    width: 300,
  },
  siteControls: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  siteLockControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  messageControl: {
    marginTop: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    marginLeft: 10,
  },
  switchLabel: {
    marginRight: 10,
    color: Colors.dark.icon,
  },
  controlLabel: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: Colors.dark.tint,
  },
  messageInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: Colors.dark.text,
    backgroundColor: '#222',
    minHeight: 60,
  },
  clearControl: {
    marginBottom: 20,
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  updateButton: {
    backgroundColor: '#2ecc71',
    marginTop: 5,
  },
  confirmContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -175 }, { translateY: -125 }],
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    padding: 20,
    borderRadius: 10,
    zIndex: 10,
    alignItems: 'center',
    width: 350,
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  confirmTitle: {
    color: '#e74c3c',
    marginBottom: 15,
  },
  confirmText: {
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  includeWinnersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#666',
    flex: 1,
    marginRight: 5,
  },
  confirmButton: {
    backgroundColor: '#e74c3c',
    flex: 1,
    marginLeft: 5,
  },
}); 