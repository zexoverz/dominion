import { getGenerals } from '@/lib/api';
import GeneralCard from '@/components/GeneralCard';

export default async function GeneralsPage() {
  let generals: any[] = [];
  try { generals = await getGenerals(); } catch {}

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-lg mb-6" style={{ color: '#00f0ff', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        The Council
      </h1>

      {generals.length === 0 ? (
        <div className="text-center py-8 text-sm" style={{ color: 'rgba(226,232,240,0.4)' }}>
          NO GENERALS REGISTERED
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {generals.map((g: any) => (
            <GeneralCard key={g.id || g.name} general={g} />
          ))}
        </div>
      )}
    </div>
  );
}
