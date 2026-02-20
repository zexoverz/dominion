export default function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color?: string }) {
  return (
    <div className="glass glass-hover rounded-xl p-5 transition-all duration-300 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-medium uppercase tracking-wider text-white/40">{label}</span>
      </div>
      <p className={`text-3xl font-bold ${color || 'gradient-text'}`}>{value}</p>
    </div>
  );
}
