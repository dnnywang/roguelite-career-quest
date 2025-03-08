
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
  const { inCombat, showCardSelection, gameOver } = gameState;

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
    <div className="game-container">
      <div className="game-world networking-event relative">
        {/* Grid lines for visual reference */}
        <div className="absolute inset-0 grid grid-cols-25 grid-rows-18 gap-0 opacity-10 pointer-events-none">
          {Array.from({ length: 25 * 18 }).map((_, i) => (
            <div key={i} className="border border-black w-32 h-32"></div>
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
