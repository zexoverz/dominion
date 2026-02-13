export default function NotFound() {
  return (
    <div className="min-h-screen bg-throne-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-pixel text-throne-gold mb-4">404</h1>
        <p className="text-throne-goldLight font-pixel text-sm">This realm does not exist</p>
        <a href="/" className="mt-6 inline-block text-throne-violet hover:text-throne-gold font-pixel text-xs">
          ← Return to the Throne Room
        </a>
      </div>
    </div>
  );
}
