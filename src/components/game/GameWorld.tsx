import React, { useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import Player from './Player';
import NPC from './NPC';
import StatsBar from './StatsBar';
import CombatScreen from './CombatScreen';
import CardSelection from './CardSelection';
import GameOverScreen from './GameOverScreen';

const GameWorld: React.FC = () => {
  const { gameState, npcs, movePlayer } = useGame();
  const { inCombat, showCardSelection, gameOver, level } = gameState;

  // Get background class based on level
  const getBackgroundClass = () => {
    switch (level) {
      case 1:
        return 'networking-event';
      case 2:
        return 'office';
      case 3:
        return 'sf-street';
      case 4:
        return 'sewer';
      default:
        return 'networking-event';
    }
  };

  // Get level name based on level
  const getLevelName = () => {
    switch (level) {
      case 1:
        return 'Networking Event';
      case 2:
        return 'Office';
      case 3:
        return 'San Francisco Street';
      case 4:
        return 'Sewer';
      default:
        return 'Networking Event';
    }
  };

  // Set up key press listener for movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          movePlayer('up');
          break;
        case 's':
        case 'arrowdown':
          movePlayer('down');
          break;
        case 'a':
        case 'arrowleft':
          movePlayer('left');
          break;
        case 'd':
        case 'arrowright':
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
    <div className="game-container flex items-center justify-center overflow-hidden">
      <div className={`game-world ${getBackgroundClass()} absolute inset-0 w-full h-full`}>
        {/* Level indicator */}
        <div className="absolute top-6 left-6 bg-black bg-opacity-70 text-white px-4 py-2 rounded-md text-lg font-medium z-20">
          Level {level}: {getLevelName()}
        </div>
        
        {/* Grid lines for visual reference */}
        <div className="absolute inset-0 grid grid-cols-30 grid-rows-20 gap-0 opacity-5 pointer-events-none">
          {Array.from({ length: 30 * 20 }).map((_, i) => (
            <div key={i} className="border border-black"></div>
          ))}
        </div>
        
        <Player />
        {npcs.map(npc => (
          <NPC key={npc.id} npc={npc} />
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <StatsBar />
      </div>
      
      {/* Show combat screen when in combat */}
      {inCombat && <CombatScreen />}
      
      {/* Show card selection after successful combat */}
      {showCardSelection && <CardSelection />}
      
      {/* Show game over screen when game is over */}
      {gameOver && <GameOverScreen />}
    </div>
  );
};

export default GameWorld;
