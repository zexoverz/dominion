export default function PokemonButton({ children, blue, onClick, type, className }: { children: React.ReactNode; blue?: boolean; onClick?: () => void; type?: 'button' | 'submit'; className?: string }) {
  return (
    <button type={type || 'button'} onClick={onClick} className={`pkmn-btn ${blue ? 'pkmn-btn-blue' : ''} ${className || ''}`}>
      {children}
    </button>
  );
}
