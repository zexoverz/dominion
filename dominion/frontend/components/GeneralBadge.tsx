import { getGeneralConfig } from '@/lib/generals-config';

export default function GeneralBadge({ name, size = 'sm' }: { name: string; size?: 'sm' | 'lg' }) {
  const g = getGeneralConfig(name);
  const textSize = size === 'lg' ? 'text-2xl' : 'text-base';
  const nameSize = size === 'lg' ? 'text-sm font-pixel' : 'text-xs';
  return (
    <span className="inline-flex items-center gap-1">
      <span className={textSize}>{g.icon}</span>
      <span className={`${nameSize} font-bold`} style={{ color: g.color }}>{g.name}</span>
    </span>
  );
}
