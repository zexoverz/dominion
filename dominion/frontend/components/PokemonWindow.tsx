export default function PokemonWindow({ children, title, cream, className }: { children: React.ReactNode; title?: string; cream?: boolean; className?: string }) {
  return (
    <div className={`${cream ? 'pkmn-window-cream' : 'pkmn-window'} ${className || ''}`}>
      {title && <div className="text-[10px] mb-2 uppercase font-bold">{title}</div>}
      {children}
    </div>
  );
}
