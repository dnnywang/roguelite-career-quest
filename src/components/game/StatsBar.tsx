
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Briefcase, Star, Heart } from 'lucide-react';

const StatsBar: React.FC = () => {
  const { gameState } = useGame();
  const { reputation, experience, charisma } = gameState;

  return (
    <div className="bg-game-dark-gray text-white p-3 rounded-md">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="flex items-center mb-1">
            <Heart className="w-4 h-4 mr-2 text-game-red" />
            <span className="text-sm font-pixel">Reputation: {reputation}</span>
          </div>
          <div className="stat-bar">
            <div 
              className="stat-fill reputation-fill animate-stat-fill" 
              style={{ width: `${reputation}%`, '--stat-value': `${reputation}%` } as React.CSSProperties}
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-1">
            <Briefcase className="w-4 h-4 mr-2 text-game-green" />
            <span className="text-sm font-pixel">Experience: {experience}</span>
          </div>
          <div className="stat-bar">
            <div 
              className="stat-fill experience-fill animate-stat-fill" 
              style={{ width: `${experience}%`, '--stat-value': `${experience}%` } as React.CSSProperties}
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-1">
            <Star className="w-4 h-4 mr-2 text-game-yellow" />
            <span className="text-sm font-pixel">Charisma: {charisma}/10</span>
          </div>
          <div className="stat-bar">
            <div 
              className="stat-fill charisma-fill animate-stat-fill" 
              style={{ width: `${charisma * 10}%`, '--stat-value': `${charisma * 10}%` } as React.CSSProperties}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
