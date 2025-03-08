
import React from 'react';
import { useGame } from '@/contexts/GameContext';

const Player: React.FC = () => {
  const { gameState } = useGame();
  const { playerPosition } = gameState;

  return (
    <div 
      className="char pixel-art animate-pixel-bounce bg-red-500"
      style={{ 
        left: `${playerPosition.x}px`, 
        top: `${playerPosition.y}px`,
        zIndex: 10
      }}
    >
      <div className="text-[8px] text-white font-bold text-center pt-1">
        YOU
      </div>
    </div>
  );
};

export default Player;
