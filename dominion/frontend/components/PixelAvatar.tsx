import Image from 'next/image';
import { getGeneralConfig } from '@/lib/generals-config';

const SIZES = {
  sm: 32,
  lg: 64,
  xl: 128,
};

export default function PixelAvatar({ generalId, size = 'sm' }: { generalId: string; size?: 'sm' | 'lg' | 'xl' }) {
  const cfg = getGeneralConfig(generalId);
  const px = SIZES[size];

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: px, height: px }}
    >
      <Image
        src={cfg.sprite}
        alt={cfg.name}
        width={px}
        height={px}
        unoptimized
        style={{ imageRendering: 'pixelated' }}
        className="pixel-avatar"
      />
    </div>
  );
}
