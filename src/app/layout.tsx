import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { LoadingManager } from '@/components/LoadingManager';

// Optimize font loading with display swap
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', 
  preload: true
});

export const metadata: Metadata = {
  title: 'Santos Event Draw',
  description: 'Santos clothing brand event draw system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          /* Prevent FOUC (Flash of Unstyled Content) */
          .santos-app {
            opacity: 0;
          }
          
          .santos-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }
          
          .santos-logo {
            font-family: 'Montserrat', sans-serif;
            font-weight: 700;
            font-size: 30px;
            color: #fff;
            margin-bottom: 24px;
            letter-spacing: 4px;
            text-transform: uppercase;
            position: relative;
          }
          
          .santos-logo:after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #fff, transparent);
            width: 70%;
            margin: 0 auto;
          }
          
          .santos-spinner {
            width: 36px;
            height: 36px;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            border-top-color: #fff;
            animation: santosSpin 1s linear infinite;
          }
          
          @keyframes santosSpin {
            to {
              transform: rotate(360deg);
            }
          }
          
          body {
            background-color: #000;
            color: #fff;
            margin: 0;
            padding: 0;
          }
        `}} />
      </head>
      <body className={inter.className}>
        {/* Initial loader that shows while JS loads */}
        <div id="santos-initial-loader" className="santos-loader">
          <div className="santos-logo">SANTOS</div>
          <div className="santos-spinner"></div>
        </div>
        
        {/* Main content */}
        <div 
          id="santos-app" 
          className="santos-app"
          style={{ 
            minHeight: '100vh',
            backgroundColor: '#000',
            color: '#fff'
          }}
        >
          <LoadingManager />
          <div className="flex flex-col min-h-screen">
            <header>
              <Navbar />
            </header>
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
} 