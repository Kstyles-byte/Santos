'use client';

export default function Loading() {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div 
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: '700',
          fontSize: '30px',
          color: '#FFFFFF',
          marginBottom: '24px',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          position: 'relative',
        }}
      >
        SANTOS
      </div>
      
      <div 
        style={{
          width: '36px',
          height: '36px',
          border: '3px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          borderTopColor: '#FFFFFF',
          animation: 'santosSpin 1s linear infinite',
        }}
      />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');
        
        @keyframes santosSpin {
          to {
            transform: rotate(360deg);
          }
        }
      `}} />
    </div>
  );
} 