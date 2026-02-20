'use client';
import { useEffect, useState } from 'react';
import RPGPanel from '@/components/RPGPanel';
import StatusBadge from '@/components/StatusBadge';
import SwordDivider from '@/components/SwordDivider';
import GeneralBadge from '@/components/GeneralBadge';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://dominion-api-production.up.railway.app';

export default function CommandPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [costs, setCosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/proposals`, { cache: 'no-store' }).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/costs/daily`, { cache: 'no-store' }).then(r => r.json()).catch(() => []),
    ]).then(([p, c]) => { setProposals(p); setCosts(c); setLoading(false); });
  }, []);

  const handleAction = async (id: string, action: string) => {
    await fetch(`${API}/api/proposals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: action }),
    });
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: action } : p));
  };

  const pending = proposals.filter(p => p.status === 'pending');
  const others = proposals.filter(p => p.status !== 'pending');

  if (loading) return (
    <div className="text-center mt-10">
      <span className="font-pixel text-gold" style={{ fontSize: '10px' }}>Loading...</span>
      <progress className="nes-progress is-primary" value="70" max="100" style={{ marginTop: '16px' }} />
    </div>
  );

  return (
    <div className="space-y-4">
      <h1 className="font-pixel text-gold text-sm sm:text-lg">
        <i className="nes-icon trophy is-small"></i> War Room
      </h1>

      {/* Pending Proposals */}
      <RPGPanel title={`Pending Orders (${pending.length})`}>
        {pending.length === 0 ? (
          <p className="text-brown-dark text-sm italic">No pending proposals.</p>
        ) : (
          <div className="space-y-3">
            {pending.map(p => (
              <div key={p.id} className="nes-container is-rounded rpg-ornament">
                <div className="font-bold text-brown-dark mb-1">{p.title || p.name}</div>
                {p.description && <p className="text-sm text-brown-dark mb-2">{p.description}</p>}
                {p.general && <div className="mb-2"><GeneralBadge name={p.general} /></div>}
                <div className="flex gap-2">
                  <button onClick={() => handleAction(p.id, 'approved')} className="nes-btn is-success" style={{ fontSize: '8px' }}>
                    ✅ Approve
                  </button>
                  <button onClick={() => handleAction(p.id, 'rejected')} className="nes-btn is-error" style={{ fontSize: '8px' }}>
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </RPGPanel>

      {/* Cost Overview */}
      {costs.length > 0 && (
        <>
          <SwordDivider label="TREASURY" />
          <RPGPanel title="Cost Overview">
            <table className="nes-table is-bordered is-centered" style={{ width: '100%', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '8px' }}>Date</th>
                  <th style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '8px' }}>Gold</th>
                </tr>
              </thead>
              <tbody>
                {costs.slice(0, 7).map((c: any, i: number) => (
                  <tr key={i}>
                    <td>{c.date || `Day ${i + 1}`}</td>
                    <td className="font-bold text-gold">${Number(c.total_cost || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </RPGPanel>
        </>
      )}

      {/* Past Proposals */}
      {others.length > 0 && (
        <>
          <SwordDivider label="PAST ORDERS" />
          <RPGPanel title="Past Orders">
            <div className="space-y-2">
              {others.slice(0, 10).map(p => (
                <div key={p.id} className="flex items-center justify-between p-2" style={{ borderBottom: '2px solid #e8dcc8' }}>
                  <span className="text-sm text-brown-dark">{p.title || p.name}</span>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          </RPGPanel>
        </>
      )}
    </div>
  );
}
