import './globals.css';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'Dominion — AI Command Center',
  description: 'Strategic AI Operations Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface-primary text-white antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
