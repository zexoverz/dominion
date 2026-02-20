import React from 'react';
import ThroneSprite from './ThroneSprite';
import SeerSprite from './SeerSprite';
import PhantomSprite from './PhantomSprite';
import GrimoireSprite from './GrimoireSprite';
import EchoSprite from './EchoSprite';
import MammonSprite from './MammonSprite';
import WraithEyeSprite from './WraithEyeSprite';

export { ThroneSprite, SeerSprite, PhantomSprite, GrimoireSprite, EchoSprite, MammonSprite, WraithEyeSprite };

export type SpriteState = 'idle' | 'working' | 'thinking' | 'walking' | 'talking' | 'celebrating';

interface SpriteProps {
  size?: number;
  state?: SpriteState;
  className?: string;
}

const spriteMap: Record<string, React.FC<SpriteProps>> = {
  throne: ThroneSprite,
  seer: SeerSprite,
  phantom: PhantomSprite,
  grimoire: GrimoireSprite,
  echo: EchoSprite,
  mammon: MammonSprite,
  'wraith-eye': WraithEyeSprite,
  wraithEye: WraithEyeSprite,
  wraitheye: WraithEyeSprite,
};

export function getGeneralSprite(
  id: string,
  state: SpriteState = 'idle',
  size: number = 96,
  className?: string
): React.ReactElement | null {
  const Component = spriteMap[id.toLowerCase()];
  if (!Component) return null;
  return <Component size={size} state={state} className={className} />;
}

export default spriteMap;
