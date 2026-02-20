import { getGenerals } from '@/lib/api';
import RPGPanel from '@/components/RPGPanel';
import { getGeneralConfig } from '@/lib/generals-config';
import PixelAvatar from '@/components/PixelAvatar';
import SwordDivider from '@/components/SwordDivider';
import ErrorState from '@/components/ErrorState';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function GeneralsPage() {
  const generals = await getGenerals().catch(() => []);

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="font-pixel text-gold text-sm sm:text-lg">⚔ THE BARRACKS ⚔</h1>
        <p className="text-brown-dark text-sm mt-2">Choose your warrior</p>
      </div>

      <SwordDivider label="SELECT GENERAL" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {generals.map((g: any) => {
          const cfg = getGeneralConfig(g.name || g.id);
          const isActive = g.status === 'active' || g.status === 'running';
          return (
            <Link key={g.id} href={`/generals/${g.id}`} className="block">
              <div
                className="nes-container text-center"
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  borderColor: isActive ? cfg.color : undefined,
                }}
              >
                {/* Character sprite */}
                <div className="flex justify-center mb-3">
                  <PixelAvatar generalId={cfg.id} size="lg" />
                </div>

                {/* Name */}
                <div className="font-pixel mb-1" style={{ fontSize: '9px', color: cfg.color }}>{cfg.name}</div>

                {/* Role */}
                <div className="text-xs text-brown-dark mb-2">{cfg.role}</div>

                {/* Status indicator */}
                <div className="flex justify-center">
                  {isActive ? (
                    <span className="nes-badge">
                      <span className="is-success" style={{ fontSize: '7px' }}>ACTIVE</span>
                    </span>
                  ) : (
                    <span className="nes-badge">
                      <span className="is-dark" style={{ fontSize: '7px' }}>IDLE</span>
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {generals.length === 0 && (
        <ErrorState message="No generals found in the barracks." />
      )}
    </div>
  );
}
