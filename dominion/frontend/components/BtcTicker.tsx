'use client';
import { useEffect, useState } from 'react';

export default function BtcTicker() {
  const [price, setPrice] = useState<string | null>(null);
  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
      .then(r => r.json())
      .then(d => setPrice(d?.bitcoin?.usd?.toLocaleString()))
      .catch(() => {});
    const i = setInterval(() => {
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        .then(r => r.json())
        .then(d => setPrice(d?.bitcoin?.usd?.toLocaleString()))
        .catch(() => {});
    }, 60000);
    return () => clearInterval(i);
  }, []);
  if (!price) return null;
  return <span className="text-xs font-pixel text-gold">₿ ${price}</span>;
}
