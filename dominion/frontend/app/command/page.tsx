'use client';

import { useState } from 'react';
import PokemonWindow from '@/components/PokemonWindow';
import PokemonButton from '@/components/PokemonButton';
import TextBox from '@/components/TextBox';

export default function CommandPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState('');
  const [proposals, setProposals] = useState<any[]>([]);

  async function loadProposals() {
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'https://dominion-api-production.up.railway.app') + '/api/proposals', { cache: 'no-store' });
      if (res.ok) setProposals(await res.json());
    } catch {}
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setResult('');
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'https://dominion-api-production.up.railway.app') + '/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (res.ok) {
        setResult('Proposal submitted successfully!');
        setTitle('');
        setDescription('');
        loadProposals();
      } else {
        setResult('Failed to submit proposal.');
      }
    } catch {
      setResult('Error submitting proposal.');
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-4">
      <PokemonWindow>
        <TextBox>
          <div className="text-[9px]">PROFESSOR OAK: What would you like to do?</div>
        </TextBox>
      </PokemonWindow>

      <PokemonWindow cream title="CREATE PROPOSAL">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[8px] block mb-1">TITLE</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2 text-[9px] border-2 border-[#404040] rounded bg-[#f8f8f8]"
              placeholder="Enter proposal title..."
            />
          </div>
          <div>
            <label className="text-[8px] block mb-1">DESCRIPTION</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2 text-[9px] border-2 border-[#404040] rounded bg-[#f8f8f8] h-24 resize-none"
              placeholder="Describe your proposal..."
            />
          </div>
          <PokemonButton type="submit" className={submitting ? 'opacity-50' : ''}>
            {submitting ? 'SUBMITTING...' : 'USE PROPOSAL!'}
          </PokemonButton>
        </form>
        {result && <div className="text-[8px] mt-2 text-[#48d048]">{result}</div>}
      </PokemonWindow>

      <PokemonWindow title="ITEMS IN BAG — PROPOSALS">
        <PokemonButton blue onClick={loadProposals} className="mb-3 text-[7px]">REFRESH</PokemonButton>
        {proposals.length === 0 && <div className="text-[8px] text-[#909090]">No proposals yet. Click REFRESH to load.</div>}
        {proposals.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 py-2 border-b border-[#d0d0d0] last:border-0">
            <img src="/assets/pokemon/pokeball.png" alt="" width={16} height={16} className="pixel" />
            <div className="flex-1">
              <div className="text-[8px] font-bold">{p.title}</div>
              <div className="text-[7px] text-[#909090]">{p.status || 'pending'}</div>
            </div>
          </div>
        ))}
      </PokemonWindow>
    </div>
  );
}
