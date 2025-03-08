
import React from 'react';
import { NPC as NPCType } from '@/contexts/GameContext';

type NPCProps = {
  npc: NPCType;
};

const NPC: React.FC<NPCProps> = ({ npc }) => {
  if (npc.defeated) {
    return null;
  }

  // Get color based on NPC type
  const getColor = () => {
    switch (npc.type) {
      case 'Recruiter':
        return 'bg-blue-500';
      case 'Intern':
        return 'bg-green-500';
      case 'Student':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`npc pixel-art animate-pixel-bounce ${getColor()}`}
      style={{
        left: `${npc.position.x}px`,
        top: `${npc.position.y}px`,
      }}
    >
      <div className="text-[8px] text-white font-bold text-center pt-1">
        {npc.type}
      </div>
    </div>
  );
};

export default NPC;
