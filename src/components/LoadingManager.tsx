'use client';

import { useEffect } from 'react';

export function LoadingManager() {
  useEffect(() => {
    // Hide the initial loader and show content when everything is loaded
    const handleFullLoad = () => {
      const loader = document.getElementById('santos-initial-loader');
      const content = document.getElementById('santos-app');
      
      if (loader && content) {
        // Hide loader with a fade effect
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s ease';
        
        // Wait for fade to complete before hiding completely
        setTimeout(() => {
          loader.style.display = 'none';
          
          // Make content visible with a fade in
          content.style.opacity = '1';
          content.style.transition = 'opacity 0.3s ease';
        }, 500);
      }
    };

    // If the page is already loaded
    if (document.readyState === 'complete') {
      // Allow a small delay to ensure styles are applied
      setTimeout(handleFullLoad, 300);
    } else {
      // Wait for everything to load, including CSS
      window.addEventListener('load', () => {
        setTimeout(handleFullLoad, 300);
      });
    }
    
    return () => {
      window.removeEventListener('load', handleFullLoad);
    };
  }, []);

  return null; // This component renders nothing
} 