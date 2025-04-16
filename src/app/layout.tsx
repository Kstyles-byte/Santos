import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={`${inter.className} min-h-screen bg-black text-white`}>
        <div className="flex flex-col min-h-screen">
          <header>
            <Navbar />
          </header>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="py-4 text-center text-gray-500 text-sm border-t border-gray-800">
            © {new Date().getFullYear()} Santos Clothing. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  );
} 