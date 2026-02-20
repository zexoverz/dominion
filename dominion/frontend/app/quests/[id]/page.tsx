import { getMission } from '@/lib/api';
import RPGPanel from '@/components/RPGPanel';
import GeneralBadge from '@/components/GeneralBadge';
import StatusBadge from '@/components/StatusBadge';
import RPGProgress from '@/components/RPGProgress';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function QuestDetail({ params }: { params: { id: string } }) {
  const mission = await getMission(params.id);
  const steps = mission.steps || [];
  const done = steps.filter((s: any) => s.status === 'completed' || s.status === 'done').length;

  const stepIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': case 'done': return '✅';
      case 'running': case 'active': return '⏳';
      default: return '☐';
    }
  };

  return (
    <div className="space-y-4">
      <Link href="/quests" className="text-royal text-sm hover:underline">← Back to Quest Board</Link>

      <RPGPanel>
        <div className="flex items-start justify-between gap-2 mb-3">
          <h1 className="font-pixel text-gold text-xs sm:text-sm">{mission.title || mission.name}</h1>
          <StatusBadge status={mission.status || 'pending'} />
        </div>
        {mission.general && <div className="mb-3"><GeneralBadge name={mission.general} size="lg" /></div>}
        {mission.description && <p className="text-brown-dark mb-3">{mission.description}</p>}
        {steps.length > 0 && <RPGProgress value={done} max={steps.length} label="Quest Progress" />}
      </RPGPanel>

      {steps.length > 0 && (
        <RPGPanel title="Quest Steps">
          <div className="space-y-2">
            {steps.map((step: any, i: number) => (
              <div key={step.id || i} className="flex items-start gap-2 p-2 bg-parchment border border-brown-border">
                <span className="text-lg">{stepIcon(step.status)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-brown-dark">{step.title || step.name || `Step ${i + 1}`}</div>
                  {step.description && <div className="text-xs text-brown-dark mt-1">{step.description}</div>}
                  {step.result && <div className="text-xs text-forest mt-1 italic">{step.result}</div>}
                </div>
              </div>
            ))}
          </div>
        </RPGPanel>
      )}
    </div>
  );
}
