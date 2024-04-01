import { ContextProvider } from '@/components/ContextProvider';
import Navigation from '@/components/Navigation';
import '@rainbow-me/rainbowkit/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ai NFT Generator',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider>
          <Navigation />
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
