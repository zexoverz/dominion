import { getGenerals } from '@/lib/api';
import RPGPanel from '@/components/RPGPanel';
import { getGeneralConfig } from '@/lib/generals-config';
import PixelAvatar from '@/components/PixelAvatar';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function GeneralsPage() {
  const generals = await getGenerals().catch(() => []);

  return (
    <div className="space-y-4">
      <h1 className="font-pixel text-gold text-sm sm:text-lg">
        <i className="nes-icon is-small heart"></i> Barracks
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {generals.map((g: any) => {
          const cfg = getGeneralConfig(g.name || g.id);
          return (
            <Link key={g.id} href={`/generals/${g.id}`} className="block">
              <div className="nes-container rpg-ornament" style={{ cursor: 'pointer' }}>
                <div className="flex items-center gap-3 mb-2">
                  <PixelAvatar generalId={cfg.id} size="lg" />
                  <div>
                    <div className="font-pixel" style={{ fontSize: '10px', color: cfg.color }}>{cfg.name}</div>
                    <div className="text-xs text-brown-dark">{cfg.role}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-brown-dark">
                  <span className={`font-bold ${g.status === 'active' ? 'nes-text is-success' : ''}`}>
                    {g.status || 'idle'}
                  </span>
                  {g.last_active && <span>{new Date(g.last_active).toLocaleDateString()}</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {generals.length === 0 && (
        <RPGPanel>
          <p className="text-brown-dark text-sm italic">No generals found in the barracks.</p>
        </RPGPanel>
      )}
    </div>
  );
}
