
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { PlusCircle, MinusCircle } from 'lucide-react';

const CardSelection: React.FC = () => {
  const { selectedCards, selectCard } = useGame();

  // Helper function for showing stat changes
  const renderStatChange = (value: number, label: string) => {
    if (value === 0) return null;
    
    return (
      <div className="flex items-center mt-1">
        {value > 0 ? 
          <PlusCircle className="w-4 h-4 mr-1 text-game-green" /> : 
          <MinusCircle className="w-4 h-4 mr-1 text-game-red" />
        }
        <span className={value > 0 ? "text-game-green" : "text-game-red"}>
          {value > 0 ? `+${value}` : value} {label}
        </span>
      </div>
    );
  };

  // Helper to determine card background based on rarity
  const getCardBackground = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100';
      case 'uncommon':
        return 'bg-blue-50';
      case 'rare':
        return 'bg-purple-50';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-6 text-center">Choose Your Next Move</h2>
        
        <div className="grid grid-cols-2 gap-6">
          {selectedCards.map(card => (
            <div 
              key={card.id}
              className={`card ${getCardBackground(card.rarity)} p-4 rounded-lg border-2 cursor-pointer hover:shadow-lg`}
              onClick={() => selectCard(card)}
            >
              <div className="text-right mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  card.rarity === 'common' ? 'bg-gray-200' : 
                  card.rarity === 'uncommon' ? 'bg-blue-200' : 'bg-purple-200'
                }`}>
                  {card.rarity}
                </span>
              </div>
              
              <h3 className="text-lg font-bold mb-2">{card.name}</h3>
              <p className="text-sm mb-4 text-gray-600">{card.description}</p>
              
              <div className="mt-auto">
                {renderStatChange(card.reputationChange, "Reputation")}
                {renderStatChange(card.experienceChange, "Experience")}
                {renderStatChange(card.charismaChange, "Charisma")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardSelection;
