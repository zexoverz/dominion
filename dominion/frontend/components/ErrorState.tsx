export default function ErrorState({ message = 'Something went wrong!' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="nes-container is-dark" style={{ padding: '16px', textAlign: 'center', maxWidth: '320px' }}>
        <p className="font-pixel text-crimson mb-2" style={{ fontSize: '12px' }}>⚠ ERROR ⚠</p>
        <p className="text-parchment-light text-sm">{message}</p>
      </div>
    </div>
  );
}
