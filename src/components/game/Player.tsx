
import React from 'react';
import { useGame } from '@/contexts/GameContext';

const Player: React.FC = () => {
  const { gameState } = useGame();
  const { playerPosition } = gameState;

  return (
    <div 
      className="char pixel-art animate-pixel-bounce"
      style={{ 
        left: `${playerPosition.x}px`, 
        top: `${playerPosition.y}px`,
        zIndex: 10,
        width: '32px',
        height: '32px',
        backgroundImage: 'url(/sprites/player.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated'
      }}
    >
      <div className="text-[8px] text-white font-bold text-center pt-1 bg-black bg-opacity-50">
        YOU
      </div>
    </div>
  );
};

export default Player;
