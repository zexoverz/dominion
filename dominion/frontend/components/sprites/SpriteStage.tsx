import React from 'react';
import { getGeneralSprite, SpriteState } from './index';

interface SpriteStageProps {
  generalId: string;
  name: string;
  state?: SpriteState;
  actionText?: string;
  status?: 'online' | 'busy' | 'idle' | 'offline';
  size?: number;
  className?: string;
}

const statusColors: Record<string, string> = {
  online: '#00E676',
  busy: '#FF9100',
  idle: '#FFD740',
  offline: '#616161',
};

const SpriteStage: React.FC<SpriteStageProps> = ({
  generalId,
  name,
  state = 'idle',
  actionText,
  status = 'online',
  size = 96,
  className,
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 70%, #0f3460 100%)',
        borderRadius: 12,
        padding: '16px 20px 12px',
        border: '1px solid #2a2a4a',
        minWidth: size + 40,
        position: 'relative',
      }}
    >
      {/* Status dot */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: statusColors[status] || statusColors.offline,
          boxShadow: `0 0 6px ${statusColors[status] || statusColors.offline}`,
        }}
      />

      {/* Sprite */}
      <div style={{ position: 'relative' }}>
        {getGeneralSprite(generalId, state, size)}
        {/* Floor shadow */}
        <div
          style={{
            position: 'absolute',
            bottom: -4,
            left: '50%',
            transform: 'translateX(-50%)',
            width: size * 0.6,
            height: 4,
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Floor line */}
      <div
        style={{
          width: '100%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
          margin: '4px 0 8px',
        }}
      />

      {/* Name */}
      <div
        style={{
          color: '#E0E0E0',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        {name}
      </div>

      {/* Action text */}
      {actionText && (
        <div
          style={{
            color: '#78909C',
            fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
            marginTop: 4,
            textAlign: 'center',
            maxWidth: size + 20,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {actionText}
        </div>
      )}
    </div>
  );
};

export default SpriteStage;
