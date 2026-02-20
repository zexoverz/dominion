import './globals.css';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false });
const RadialMenu = dynamic(() => import('@/components/RadialMenu'), { ssr: false });

export const metadata: Metadata = {
  title: 'DOMINION COMMAND',
  description: 'Holographic Command Interface',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Scene3D />
        <div className="relative" style={{ zIndex: 10, minHeight: '100vh' }}>
          {children}
        </div>
        <RadialMenu />
      </body>
    </html>
  );
}
