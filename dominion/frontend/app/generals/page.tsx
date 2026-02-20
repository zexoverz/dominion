import { getGenerals } from '@/lib/api';
import GeneralCard from '@/components/GeneralCard';

export default async function GeneralsPage() {
  let generals: any[] = [];
  try { generals = await getGenerals(); } catch {}
  if (!Array.isArray(generals)) generals = [];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Generals</h1>
        <p className="text-sm text-white/30">AI agents powering the operation</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {generals.length === 0 ? (
          <p className="text-white/30">No generals found</p>
        ) : (
          generals.map((g: any) => <GeneralCard key={g.id || g.name} general={g} />)
        )}
      </div>
    </div>
  );
}
