'use client';

import { useEffect } from 'react';

export function useDatabaseCheck() {
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        console.log('Checking database tables...');
        
        // Call an API endpoint to check database tables
        const response = await fetch('/api/check-db');
        const data = await response.json();
        
        console.log('Database check result:', data);
      } catch (error) {
        console.error('Error checking database:', error);
      }
    };
    
    checkDatabase();
  }, []);
} 