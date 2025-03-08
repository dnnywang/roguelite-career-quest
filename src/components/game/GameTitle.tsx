
import React from 'react';
import { Button } from '@/components/ui/button';

type GameTitleProps = {
  onStartGame: () => void;
};

const GameTitle: React.FC<GameTitleProps> = ({ onStartGame }) => {
  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold mb-6 text-game-blue">LinkedIn Roguelite</h1>
      <p className="text-xl mb-8 max-w-lg mx-auto text-game-gray">
        Navigate the professional world, answer tech questions, and build your career in this unique roguelite game!
      </p>
      
      <div className="flex justify-center mb-12">
        <Button 
          onClick={onStartGame} 
          className="bg-game-blue hover:bg-game-dark-blue text-white text-xl px-8 py-6"
        >
          Start Career Quest
        </Button>
      </div>
      
      <div className="bg-game-light-gray p-4 rounded-md inline-block">
        <h2 className="font-bold mb-2">Controls</h2>
        <ul className="text-left">
          <li>Movement: WASD or Arrow Keys</li>
          <li>Interact with NPCs: Move toward them</li>
        </ul>
      </div>
    </div>
  );
};

export default GameTitle;
