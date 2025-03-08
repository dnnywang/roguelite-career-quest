
import React, { useEffect, useState } from 'react';
import { useGame } from '@/contexts/GameContext';

const Player: React.FC = () => {
  const { gameState, movePlayer } = useGame();
  const { playerPosition } = gameState;
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  // Handle keyboard inputs for player movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          movePlayer('up');
          break;
        case 'ArrowDown':
        case 's':
          movePlayer('down');
          break;
        case 'ArrowLeft':
        case 'a':
          setDirection('left');
          movePlayer('left');
          break;
        case 'ArrowRight':
        case 'd':
          setDirection('right');
          movePlayer('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [movePlayer]);

  return (
    <div 
      className="char pixel-art"
      style={{ 
        left: `${playerPosition.x}px`, 
        top: `${playerPosition.y}px`,
        zIndex: 10,
        width: '32px',
        height: '32px',
        backgroundImage: 'url(/sprites/player.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
        transition: 'transform 0.1s ease-in-out'
      }}
    >
      <div className="text-[8px] text-white font-bold text-center pt-1 bg-black bg-opacity-50">
        YOU
      </div>
    </div>
  );
};

export default Player;
