import './globals.css';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false });
const NavBar = dynamic(() => import('@/components/NavBar'), { ssr: false });

export const metadata: Metadata = {
  title: 'DOMINION COMMAND',
  description: 'AI Operations Command Center',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Scene3D />
        <NavBar />
        <div className="relative" style={{ zIndex: 10, minHeight: '100vh', paddingTop: 56, paddingBottom: 60 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
