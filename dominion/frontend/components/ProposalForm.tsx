'use client';

import { useState } from 'react';

export default function ProposalForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setMessage('');
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'https://dominion-api-production.up.railway.app';
      const res = await fetch(`${API}/api/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error('Failed');
      setTitle('');
      setDescription('');
      setMessage('PROPOSAL TRANSMITTED');
    } catch {
      setMessage('TRANSMISSION FAILED');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="label block mb-1">Proposal Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
          placeholder="Enter directive..."
        />
      </div>
      <div>
        <label className="label block mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
          rows={4}
          placeholder="Mission parameters..."
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 px-4 font-bold text-sm"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          background: 'rgba(0, 240, 255, 0.15)',
          border: '1px solid rgba(0, 240, 255, 0.4)',
          color: '#00f0ff',
          borderRadius: 6,
          transition: 'all 0.2s',
        }}
      >
        {submitting ? 'TRANSMITTING...' : 'SUBMIT PROPOSAL'}
      </button>
      {message && (
        <div className="text-xs text-center" style={{ color: message.includes('FAILED') ? '#ef4444' : '#22c55e' }}>
          {message}
        </div>
      )}
    </form>
  );
}
