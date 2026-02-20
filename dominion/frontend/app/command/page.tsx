'use client';
import { useEffect, useState } from 'react';
import RPGPanel from '@/components/RPGPanel';
import StatusBadge from '@/components/StatusBadge';

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

  if (loading) return <div className="font-pixel text-gold text-center mt-10">Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="font-pixel text-gold text-sm sm:text-lg">🏰 War Room</h1>

      {/* Pending Proposals */}
      <RPGPanel title={`Pending Orders (${pending.length})`}>
        {pending.length === 0 ? (
          <p className="text-brown-dark text-sm italic">No pending proposals.</p>
        ) : (
          <div className="space-y-3">
            {pending.map(p => (
              <div key={p.id} className="p-3 bg-parchment border-2 border-gold">
                <div className="font-bold text-brown-dark mb-1">{p.title || p.name}</div>
                {p.description && <p className="text-sm text-brown-dark mb-2">{p.description}</p>}
                {p.general && <div className="text-xs text-brown-dark mb-2">General: {p.general}</div>}
                <div className="flex gap-2">
                  <button onClick={() => handleAction(p.id, 'approved')} className="rpg-btn-primary text-xs">
                    ✅ Approve
                  </button>
                  <button onClick={() => handleAction(p.id, 'rejected')} className="rpg-btn-danger text-xs">
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
        <RPGPanel title="Cost Overview">
          <div className="space-y-1">
            {costs.slice(0, 7).map((c: any, i: number) => (
              <div key={i} className="flex justify-between text-sm p-1 border-b border-parchment-dark">
                <span className="text-brown-dark">{c.date || `Day ${i + 1}`}</span>
                <span className="font-bold text-gold">${Number(c.total_cost || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </RPGPanel>
      )}

      {/* Past Proposals */}
      {others.length > 0 && (
        <RPGPanel title="Past Orders">
          <div className="space-y-2">
            {others.slice(0, 10).map(p => (
              <div key={p.id} className="flex items-center justify-between p-2 bg-parchment border border-brown-border">
                <span className="text-sm text-brown-dark">{p.title || p.name}</span>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </RPGPanel>
      )}
    </div>
  );
}
