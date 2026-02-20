'use client';
import { useEffect, useState } from 'react';
import RPGPanel from '@/components/RPGPanel';
import StatusBadge from '@/components/StatusBadge';
import SwordDivider from '@/components/SwordDivider';
import GeneralBadge from '@/components/GeneralBadge';
import LoadingSpinner from '@/components/LoadingSpinner';

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

  if (loading) return <LoadingSpinner message="Entering War Room..." />;

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="font-pixel text-gold text-sm sm:text-lg">🗡️ WAR ROOM 🗡️</h1>
        <p className="text-brown-dark text-sm mt-2">{pending.length} orders awaiting approval</p>
      </div>

      <SwordDivider label="PENDING ORDERS" />

      {/* Pending Proposals */}
      {pending.length === 0 ? (
        <RPGPanel>
          <p className="text-brown-dark text-sm italic text-center py-4">No pending orders. Your generals await instruction.</p>
        </RPGPanel>
      ) : (
        <div className="space-y-3">
          {pending.map(p => (
            <div key={p.id} className="nes-container is-rounded">
              <div className="font-bold text-brown-dark mb-1 text-sm">{p.title || p.name}</div>
              {p.description && <p className="text-sm text-brown-dark mb-2">{p.description}</p>}
              {p.general && <div className="mb-3"><GeneralBadge name={p.general} /></div>}
              {p.estimated_cost && (
                <div className="text-xs text-gold mb-2 font-pixel" style={{ fontSize: '8px' }}>
                  💰 Est. Cost: ${Number(p.estimated_cost).toFixed(2)}
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => handleAction(p.id, 'approved')} className="nes-btn is-success">
                  ✅ Approve
                </button>
                <button onClick={() => handleAction(p.id, 'rejected')} className="nes-btn is-error">
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cost Overview */}
      {costs.length > 0 && (
        <>
          <SwordDivider label="TREASURY" />
          <RPGPanel title="Daily Costs">
            <div className="overflow-x-auto">
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
                      <td className="text-sm">{c.date || `Day ${i + 1}`}</td>
                      <td className="font-bold text-gold text-sm">${Number(c.total_cost || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </RPGPanel>
        </>
      )}

      {/* Past Proposals */}
      {others.length > 0 && (
        <>
          <SwordDivider label="PAST ORDERS" />
          <RPGPanel title="History">
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
