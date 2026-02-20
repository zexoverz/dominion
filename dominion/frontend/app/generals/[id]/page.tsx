import { getGeneral } from '@/lib/api';
import { GENERALS } from '@/lib/generals';
import HoloPanel from '@/components/HoloPanel';
import StatusDot from '@/components/StatusDot';
import Link from 'next/link';

export default async function GeneralPage({ params }: { params: { id: string } }) {
  let general: any = null;
  try { general = await getGeneral(params.id); } catch {}

  if (!general) {
    return (
      <div className="p-8 text-center">
        <h1 className="label">GENERAL NOT FOUND</h1>
        <Link href="/generals" className="text-xs" style={{ color: '#00f0ff' }}>← Back to Council</Link>
      </div>
    );
  }

  const key = (general.name || '').toUpperCase();
  const meta = GENERALS[key] || { name: key, role: 'Unknown', color: '#00f0ff', icon: '⬡' };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <Link href="/generals" className="label mb-4 inline-block" style={{ color: '#00f0ff' }}>
        ← THE COUNCIL
      </Link>

      <HoloPanel glow>
        <div className="flex items-center gap-4 mb-4">
          <div
            className="flex items-center justify-center"
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              border: `2px solid ${meta.color}`,
              boxShadow: `0 0 20px ${meta.color}60`,
              fontSize: 28,
            }}
          >
            {meta.icon}
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {meta.name}
            </h1>
            <p className="text-sm" style={{ color: 'rgba(226,232,240,0.5)' }}>{meta.role}</p>
            <div className="flex items-center gap-1 mt-1">
              <StatusDot status={general.status || 'online'} />
              <span className="text-xs">{general.status || 'online'}</span>
            </div>
          </div>
        </div>
      </HoloPanel>
    </div>
  );
}
