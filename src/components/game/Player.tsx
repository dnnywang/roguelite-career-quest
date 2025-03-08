
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
        backgroundImage: `url('/sprites/player.png')`,
        backgroundSize: 'cover',
        zIndex: 10
      }}
    />
  );
};

export default Player;
