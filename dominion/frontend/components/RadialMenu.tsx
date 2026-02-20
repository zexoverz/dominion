'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS = [
  { label: 'Dashboard', icon: '⬡', path: '/' },
  { label: 'Missions', icon: '⚔', path: '/missions' },
  { label: 'Intel', icon: '📡', path: '/intel' },
  { label: 'Generals', icon: '👥', path: '/generals' },
  { label: 'Command', icon: '⌘', path: '/command' },
];

export default function RadialMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleNav = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <div
      ref={containerRef}
      className="fixed z-50"
      style={{ bottom: 24, right: 24 }}
    >
      <AnimatePresence>
        {open && (
          <>
            {ITEMS.map((item, i) => {
              const angle = Math.PI / 2 + (i / (ITEMS.length - 1)) * Math.PI;
              const r = 90;
              const x = Math.cos(angle) * r;
              const y = -Math.sin(angle) * r;
              const active = isActive(item.path);

              return (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{ opacity: 1, x, y: y - 10, scale: 1 }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20, delay: i * 0.05 }}
                  onClick={() => handleNav(item.path)}
                  className="absolute flex items-center justify-center"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: active ? 'rgba(0, 240, 255, 0.3)' : 'rgba(10, 15, 30, 0.9)',
                    border: `1px solid ${active ? '#00f0ff' : 'rgba(0, 240, 255, 0.3)'}`,
                    boxShadow: active ? '0 0 15px rgba(0, 240, 255, 0.5)' : '0 0 8px rgba(0, 240, 255, 0.15)',
                    bottom: 0,
                    right: 0,
                    fontSize: 18,
                  }}
                  title={item.label}
                >
                  {item.icon}
                </motion.button>
              );
            })}
          </>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center animate-pulse-cyan"
        style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.4) 0%, rgba(10, 15, 30, 0.95) 70%)',
          border: '2px solid rgba(0, 240, 255, 0.5)',
          fontSize: 20,
          zIndex: 51,
        }}
      >
        {open ? '✕' : '◈'}
      </button>
    </div>
  );
}
