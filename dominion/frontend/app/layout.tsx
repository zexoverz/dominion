import './globals.css';
import PokemonNav from '@/components/PokemonNav';

export const metadata = {
  title: 'DOMINION — Lord Zexo',
  description: 'Dominion Control Panel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <PokemonNav />
        <main className="md:ml-56 p-4 pb-24 md:pb-4 max-w-4xl">
          {children}
        </main>
      </body>
    </html>
  );
}
