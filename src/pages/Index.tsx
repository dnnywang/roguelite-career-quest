import React, { useState } from 'react';
import { GameProvider } from '@/contexts/GameContext';
import GameWorld from '@/components/game/GameWorld';
import GameTitle from '@/components/game/GameTitle';

const Index: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen max-w-screen overflow-x-hidden bg-gradient-to-b from-game-light-gray to-gray-200 py-8">
      <div className="container mx-auto px-4 overflow-hidden">
        {!gameStarted ? (
          <GameTitle onStartGame={handleStartGame} />
        ) : (
          <GameProvider>
            <div className="flex flex-col items-center overflow-hidden">
              <h1 className="text-3xl font-bold mb-6 text-game-blue drop-shadow-lg"
                  style={{ 
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', 
                    WebkitTextStroke: '1px #005E93'
                  }}>
                LinkedIn Roguelite
              </h1>
              <p className="text-lg mb-8 max-w-lg text-center text-game-gray">
                Welcome to the Networking Event! Talk to the NPCs to build your stats.
              </p>
              <div className="w-full flex justify-center">
                <GameWorld />
              </div>
            </div>
          </GameProvider>
        )}
      </div>
    </div>
  );
};

export default Index;
