
import React from 'react';
import { NPC as NPCType } from '@/contexts/GameContext';

type NPCProps = {
  npc: NPCType;
};

const NPC: React.FC<NPCProps> = ({ npc }) => {
  if (npc.defeated) {
    return null;
  }

  // Get sprite image based on NPC type
  const getSprite = () => {
    switch (npc.type) {
      case 'Recruiter':
        return '/sprites/recruiter.png';
      case 'Intern':
        return '/sprites/intern.png';
      case 'Student':
        return '/sprites/student.png';
      default:
        return '/sprites/recruiter.png';
    }
  };

  return (
    <div
      className="npc pixel-art animate-pixel-bounce"
      style={{
        left: `${npc.position.x}px`,
        top: `${npc.position.y}px`,
        width: '32px',
        height: '32px',
        backgroundImage: `url(${getSprite()})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated'
      }}
    >
      <div className="text-[8px] text-white font-bold text-center pt-1 bg-black bg-opacity-50">
        {npc.type}
      </div>
    </div>
  );
};

export default NPC;
