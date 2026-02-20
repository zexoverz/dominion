export default function NotFound() {
  return (
    <div className="min-h-screen bg-rpg-bg flex items-center justify-center">
      <div className="rpg-panel text-center p-8">
        <h1 className="font-pixel text-[48px] text-throne-gold text-glow-gold mb-4">404</h1>
        <p className="font-pixel text-[10px] text-rpg-border mb-2">THIS REALM DOES NOT EXIST</p>
        <p className="font-body text-[9px] text-rpg-borderMid mb-6">The path you seek leads to darkness...</p>
        <a href="/" className="font-pixel text-[9px] text-throne-gold hover:text-throne-goldLight text-rpg-shadow">
          ▶ RETURN TO THRONE ROOM
        </a>
      </div>
    </div>
  );
}
