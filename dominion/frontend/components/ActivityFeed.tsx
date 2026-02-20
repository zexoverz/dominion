import { getGeneralColor } from '@/lib/generals';

export default function ActivityFeed({ events }: { events: any[] }) {
  if (!events || events.length === 0) {
    return (
      <div className="text-xs" style={{ color: 'rgba(226,232,240,0.4)' }}>
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
      {events.slice(0, 15).map((event: any, i: number) => {
        const color = getGeneralColor(event.general || event.actor || '');
        const time = event.created_at
          ? new Date(event.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
          : '';
        return (
          <div key={event.id || i} className="flex items-start gap-2 text-xs">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 5, boxShadow: `0 0 4px ${color}` }} />
            <div className="flex-1 min-w-0">
              <span style={{ color: 'rgba(226,232,240,0.8)' }}>
                {event.description || event.message || event.type || 'Event'}
              </span>
            </div>
            <span className="flex-shrink-0" style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.65rem' }}>
              {time}
            </span>
          </div>
        );
      })}
    </div>
  );
}
