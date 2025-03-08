
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
    <div className="relative">
      {/* Player name label positioned above the sprite */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 -top-5 text-[8px] text-white font-bold text-center px-1 py-0.5 bg-black bg-opacity-50 rounded-sm"
        style={{
          width: '20px',
          zIndex: 11
        }}
      >
        YOU
      </div>
      
      {/* Player sprite */}
      <div 
        className="char pixel-art"
        style={{ 
          left: `${playerPosition.x}px`, 
          top: `${playerPosition.y}px`,
          zIndex: 10,
          width: '32px',
          height: '32px',
          backgroundImage: 'url(https://cdn.discordapp.com/attachments/1070225571541434431/1347797240474894377/game_spirte.png?ex=67cd217e&is=67cbcffe&hm=928f94a7b252bb4f3b3d3eb1e003e94644e0f38f74774aba53aa3043444039fa&)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
          transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
          transition: 'transform 0.1s ease-in-out'
        }}
      />
    </div>
  );
};

export default Player;
