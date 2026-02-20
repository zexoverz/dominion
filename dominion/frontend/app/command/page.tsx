'use client';
import { useState, useEffect } from 'react';
import StatusDot from '@/components/StatusDot';

export default function CommandPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [roundtables, setRoundtables] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'https://dominion-api-production.up.railway.app';
    Promise.all([
      fetch(`${API}/api/proposals`, { cache: 'no-store' }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/roundtables`, { cache: 'no-store' }).then(r => r.ok ? r.json() : []),
    ]).then(([p, r]) => {
      setProposals(Array.isArray(p) ? p : []);
      setRoundtables(Array.isArray(r) ? r : []);
    }).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'https://dominion-api-production.up.railway.app';
      const res = await fetch(`${API}/api/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (res.ok) {
        const newP = await res.json();
        setProposals(prev => [newP, ...prev]);
        setTitle('');
        setDescription('');
      }
    } catch {} finally { setSubmitting(false); }
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Command</h1>
        <p className="text-sm text-white/30">Proposals, approvals, and roundtable decisions</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Create Proposal */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">New Proposal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Proposal title"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
            <textarea
              value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Description..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
            />
            <button
              type="submit" disabled={submitting || !title.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-3 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              {submitting ? 'Submitting...' : 'Submit Proposal'}
            </button>
          </form>
        </div>

        {/* Pending Proposals */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">Pending Approvals</h2>
          <div className="space-y-3">
            {proposals.length === 0 ? (
              <p className="text-white/30 text-sm">No proposals</p>
            ) : (
              proposals.slice(0, 10).map((p: any) => (
                <div key={p.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]">
                  <StatusDot status={p.status === 'approved' ? 'active' : p.status === 'rejected' ? 'error' : 'idle'} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 font-medium">{p.title}</p>
                    <p className="text-xs text-white/30 mt-0.5">{p.status || 'pending'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Roundtable Results */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">Roundtable Decisions</h2>
        <div className="space-y-3">
          {roundtables.length === 0 ? (
            <p className="text-white/30 text-sm">No roundtable sessions</p>
          ) : (
            roundtables.slice(0, 10).map((r: any) => (
              <div key={r.id} className="p-4 rounded-lg bg-white/[0.02] animate-fade-in">
                <p className="text-sm text-white/80 font-medium">{r.topic || r.title}</p>
                {r.outcome && <p className="text-sm text-white/40 mt-1">{r.outcome}</p>}
                <p className="text-xs text-white/20 mt-2">{r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
