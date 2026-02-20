import { getGeneralConfig } from '@/lib/generals-config';
import PixelAvatar from './PixelAvatar';

export default function GeneralBadge({ name, size = 'sm' }: { name: string; size?: 'sm' | 'lg' }) {
  const g = getGeneralConfig(name);
  const nameSize = size === 'lg' ? 'text-sm font-pixel' : 'text-xs';
  return (
    <span className="inline-flex items-center gap-2">
      <PixelAvatar generalId={g.id} size={size} />
      <span className={`${nameSize} font-bold`} style={{ color: g.color }}>{g.name}</span>
    </span>
  );
}
