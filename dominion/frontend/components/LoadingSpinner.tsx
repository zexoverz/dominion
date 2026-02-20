export default function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="animate-bounce text-4xl">⚔️</div>
      <span className="font-pixel text-gold" style={{ fontSize: '10px' }}>{message}</span>
      <progress className="nes-progress is-primary" value="70" max="100" style={{ width: '200px' }} />
    </div>
  );
}
