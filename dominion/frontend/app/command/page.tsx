import { getProposals, getRoundtables } from '@/lib/api';
import HoloPanel from '@/components/HoloPanel';
import ProposalForm from '@/components/ProposalForm';
import { getGeneralColor, getGeneralIcon } from '@/lib/generals';

export default async function CommandPage() {
  let proposals: any[] = [];
  let roundtables: any[] = [];
  try { proposals = await getProposals(); } catch {}
  try { roundtables = await getRoundtables(); } catch {}

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-lg mb-6" style={{ color: '#00f0ff', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        War Room
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <HoloPanel glow>
          <h2 className="label mb-4">New Directive</h2>
          <ProposalForm />
        </HoloPanel>

        <div className="space-y-4">
          <HoloPanel>
            <h2 className="label mb-3">Pending Proposals</h2>
            {proposals.length === 0 ? (
              <div className="text-xs" style={{ color: 'rgba(226,232,240,0.4)' }}>No proposals</div>
            ) : (
              <div className="space-y-3">
                {proposals.slice(0, 10).map((p: any) => (
                  <div key={p.id} className="p-3 rounded" style={{ background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.1)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge badge-${p.status || 'pending'}`}>{p.status || 'pending'}</span>
                    </div>
                    <h3 className="text-sm font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {p.title}
                    </h3>
                    {p.description && (
                      <p className="text-xs mt-1" style={{ color: 'rgba(226,232,240,0.5)' }}>
                        {p.description.slice(0, 100)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </HoloPanel>

          <HoloPanel>
            <h2 className="label mb-3">Roundtable Debates</h2>
            {roundtables.length === 0 ? (
              <div className="text-xs" style={{ color: 'rgba(226,232,240,0.4)' }}>No debates</div>
            ) : (
              <div className="space-y-2">
                {roundtables.slice(0, 5).map((rt: any) => (
                  <div key={rt.id}>
                    <h3 className="text-xs font-bold mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {rt.topic || rt.title || 'Debate'}
                    </h3>
                    {rt.votes && Array.isArray(rt.votes) && rt.votes.map((v: any, i: number) => {
                      const color = getGeneralColor(v.general || v.voter || '');
                      return (
                        <div
                          key={i}
                          className="mb-2 p-2 rounded text-xs"
                          style={{
                            background: 'rgba(5,5,8,0.6)',
                            borderLeft: `3px solid ${color}`,
                          }}
                        >
                          <span className="font-bold" style={{ color }}>{v.general || v.voter}</span>
                          <span className="ml-2">{v.vote || v.opinion || v.stance}</span>
                          {v.reasoning && (
                            <p className="mt-1" style={{ color: 'rgba(226,232,240,0.5)' }}>{v.reasoning}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </HoloPanel>
        </div>
      </div>
    </div>
  );
}
