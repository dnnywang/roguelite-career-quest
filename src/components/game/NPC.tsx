
import React from 'react';
import { NPC as NPCType } from '@/contexts/GameContext';

type NPCProps = {
  npc: NPCType;
};

const NPC: React.FC<NPCProps> = ({ npc }) => {
  if (npc.defeated) {
    return null;
  }

  return (
    <div
      className="npc pixel-art animate-pixel-bounce"
      style={{
        left: `${npc.position.x}px`,
        top: `${npc.position.y}px`,
        backgroundImage: `url('/sprites/${npc.type.toLowerCase()}.png')`,
        backgroundSize: 'cover'
      }}
    />
  );
};

export default NPC;
