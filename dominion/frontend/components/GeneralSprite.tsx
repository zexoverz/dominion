import { getGeneralInfo } from '@/lib/generals';

export default function GeneralSprite({ name, size = 64 }: { name: string; size?: number }) {
  const info = getGeneralInfo(name);
  if (!info) return <div className="bg-[#808080]" style={{ width: size, height: size }} />;
  return (
    <img
      src={info.sprite}
      alt={info.pokemon}
      className="pixel"
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
