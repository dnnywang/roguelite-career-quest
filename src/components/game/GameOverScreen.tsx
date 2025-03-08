
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';

const GameOverScreen: React.FC = () => {
  const { gameState, restartGame } = useGame();
  const { npcsDefeated } = gameState;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white p-8 rounded-lg max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-4 text-game-red">Game Over</h2>
        
        <p className="mb-6">Your professional reputation has been ruined.</p>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Final Stats</h3>
          <p>NPCs Defeated: {npcsDefeated}</p>
        </div>
        
        <Button 
          onClick={restartGame} 
          className="bg-game-blue hover:bg-game-dark-blue text-white px-8 py-2"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default GameOverScreen;
