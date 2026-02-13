export { default as ThroneAvatar } from './ThroneAvatar';
export { default as SeerAvatar } from './SeerAvatar';
export { default as PhantomAvatar } from './PhantomAvatar';
export { default as GrimoireAvatar } from './GrimoireAvatar';
export { default as EchoAvatar } from './EchoAvatar';
export { default as MammonAvatar } from './MammonAvatar';
export { default as WraithEyeAvatar } from './WraithEyeAvatar';

import ThroneAvatar from './ThroneAvatar';
import SeerAvatar from './SeerAvatar';
import PhantomAvatar from './PhantomAvatar';
import GrimoireAvatar from './GrimoireAvatar';
import EchoAvatar from './EchoAvatar';
import MammonAvatar from './MammonAvatar';
import WraithEyeAvatar from './WraithEyeAvatar';

const avatarMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  throne: ThroneAvatar,
  seer: SeerAvatar,
  phantom: PhantomAvatar,
  grimoire: GrimoireAvatar,
  echo: EchoAvatar,
  mammon: MammonAvatar,
  'wraith-eye': WraithEyeAvatar,
  wraithEye: WraithEyeAvatar,
  wraitheye: WraithEyeAvatar,
};

export function getGeneralAvatar(id: string): React.FC<{ size?: number; className?: string }> | undefined {
  return avatarMap[id.toLowerCase()];
}
