"use client";

import { useState, useEffect, useCallback } from "react";

interface BtcData {
  price: number;
  change24h: number;
  fearGreed: number;
  fearGreedLabel: string;
}

export default function BtcTicker() {
  const [data, setData] = useState<BtcData | null>(null);
  const [flash, setFlash] = useState(false);

  const fetchBtc = useCallback(async () => {
    try {
      const [priceRes, fgRes] = await Promise.allSettled([
        fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"),
        fetch("https://api.alternative.me/fng/?limit=1"),
      ]);

      const priceData = priceRes.status === "fulfilled" ? await priceRes.value.json() : null;
      const fgData = fgRes.status === "fulfilled" ? await fgRes.value.json() : null;

      const price = priceData?.bitcoin?.usd ?? 0;
      const change = priceData?.bitcoin?.usd_24h_change ?? 0;
      const fgValue = parseInt(fgData?.data?.[0]?.value ?? "50");
      const fgLabel = fgData?.data?.[0]?.value_classification ?? "Neutral";

      setData({ price, change24h: change, fearGreed: fgValue, fearGreedLabel: fgLabel });
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    } catch {
      // keep existing data
    }
  }, []);

  useEffect(() => {
    fetchBtc();
    const iv = setInterval(fetchBtc, 60_000);
    return () => clearInterval(iv);
  }, [fetchBtc]);

  if (!data) {
    return (
      <div className="rpg-panel px-4 py-3 mb-6 text-center">
        <span className="font-pixel text-[8px] text-rpg-borderMid animate-pulse">Loading market oracle...</span>
      </div>
    );
  }

  const isUp = data.change24h >= 0;
  const fgColor = data.fearGreed <= 25 ? "#ef4444" : data.fearGreed <= 45 ? "#f97316" : data.fearGreed <= 55 ? "#fbbf24" : data.fearGreed <= 75 ? "#a3e635" : "#22c55e";

  return (
    <div className="rpg-panel mb-6 px-3 py-3 md:px-5 md:py-4" style={{
      background: "linear-gradient(135deg, rgba(251,191,36,0.06) 0%, rgba(15,10,25,0.95) 50%, rgba(251,191,36,0.04) 100%)",
      borderColor: "#5a4a3a",
    }}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* BTC Price */}
        <div className="flex items-center gap-3">
          <span className="text-xl md:text-2xl">₿</span>
          <div>
            <p className="font-pixel text-[7px] text-rpg-borderMid tracking-widest">BITCOIN</p>
            <p className={`font-pixel text-[14px] md:text-[18px] text-throne-gold text-rpg-shadow transition-all ${flash ? "scale-105" : ""}`}>
              ${data.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* 24h Change */}
        <div className="text-center">
          <p className="font-pixel text-[7px] text-rpg-borderMid">24H</p>
          <p className={`font-pixel text-[11px] md:text-[13px] ${isUp ? "text-green-400" : "text-red-400"}`}>
            {isUp ? "▲" : "▼"} {Math.abs(data.change24h).toFixed(2)}%
          </p>
        </div>

        {/* Fear & Greed */}
        <div className="text-center">
          <p className="font-pixel text-[7px] text-rpg-borderMid">FEAR &amp; GREED</p>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-16 h-2 rounded-sm overflow-hidden" style={{ background: "#1a1028" }}>
              <div className="h-full rounded-sm transition-all" style={{ width: `${data.fearGreed}%`, backgroundColor: fgColor }} />
            </div>
            <span className="font-pixel text-[10px]" style={{ color: fgColor }}>{data.fearGreed}</span>
          </div>
          <p className="font-pixel text-[6px] mt-0.5" style={{ color: fgColor }}>{data.fearGreedLabel}</p>
        </div>
      </div>
    </div>
  );
}
