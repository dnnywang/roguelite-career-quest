
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
        return 'https://cdn.discordapp.com/attachments/1070225571541434431/1347805842572972102/image.png?ex=67cd2981&is=67cbd801&hm=1b7c6ca93ae17d917fdcd91859537993bf0d0ac051ee0b2fdb832fa465f242cd&';
      case 'Intern':
        return '/sprites/intern.png';
      case 'Student':
        return '/sprites/student.png';
      default:
        return 'https://cdn.discordapp.com/attachments/1070225571541434431/1347805842572972102/image.png?ex=67cd2981&is=67cbd801&hm=1b7c6ca93ae17d917fdcd91859537993bf0d0ac051ee0b2fdb832fa465f242cd&';
    }
  };

  // Determine sprite and hitbox size based on NPC type
  const getSpriteSize = () => {
    return npc.type === 'Recruiter' ? '48px' : '32px';
  };

  return (
    <div
      className="npc pixel-art animate-pixel-bounce"
      style={{
        left: `${npc.position.x}px`,
        top: `${npc.position.y}px`,
        width: getSpriteSize(),
        height: getSpriteSize(),
        backgroundImage: `url(${getSprite()})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated'
      }}
    >
      <div 
        className="text-[8px] text-white font-bold text-center bg-black bg-opacity-50"
        style={{
          position: 'absolute',
          width: '100%',
          top: npc.type === 'Recruiter' ? '-30px' : '1px'
        }}
      >
        {npc.type}
      </div>
    </div>
  );
};

export default NPC;
