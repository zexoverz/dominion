export default function ActivityFeed({ events }: { events: any[] }) {
  if (!events || events.length === 0) {
    return <p className="text-white/30 text-sm">No recent activity</p>;
  }
  return (
    <div className="space-y-3">
      {events.slice(0, 10).map((event: any, i: number) => (
        <div key={event.id || i} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm shrink-0 mt-0.5">
            {event.type === 'mission' ? '🎯' : event.type === 'report' ? '📄' : event.type === 'proposal' ? '📋' : '⚡'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white/70">{event.description || event.title || event.message || 'Event'}</p>
            <p className="text-xs text-white/25 mt-0.5">
              {event.general && <span className="text-white/40">{event.general}</span>}
              {event.general && event.created_at && <span> · </span>}
              {event.created_at && new Date(event.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
