'use client';
import { useEffect, useState } from 'react';

export default function BtcTicker() {
  const [price, setPrice] = useState<string | null>(null);
  useEffect(() => {
    const fetchPrice = () => {
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        .then(r => r.json())
        .then(d => setPrice(d?.bitcoin?.usd?.toLocaleString()))
        .catch(() => {});
    };
    fetchPrice();
    const i = setInterval(fetchPrice, 60000);
    return () => clearInterval(i);
  }, []);
  if (!price) return null;
  return (
    <span className="nes-badge">
      <span className="is-warning" style={{ fontSize: '8px', fontFamily: '"Press Start 2P", monospace' }}>₿ ${price}</span>
    </span>
  );
}
