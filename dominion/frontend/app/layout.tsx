import type { Metadata } from 'next';
import './globals.css';
import RPGNav from '@/components/RPGNav';

export const metadata: Metadata = {
  title: 'Dominion of Lord Zexo',
  description: 'Command your generals. Rule your domain.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-parchment">
        <RPGNav />
        <main className="md:ml-48 pb-20 md:pb-6 p-4 sm:p-6 max-w-5xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
