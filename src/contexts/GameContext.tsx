
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Defining the types for our game state
export type GameState = {
  reputation: number;
  experience: number;
  charisma: number;
  level: number;
  playerPosition: { x: number, y: number };
  npcsDefeated: number;
  inCombat: boolean;
  currentNpc: NPC | null;
  showCardSelection: boolean;
  gameOver: boolean;
};

export type NPC = {
  id: number;
  type: string;
  position: { x: number, y: number };
  defeated: boolean;
};

export type BuffCard = {
  id: number;
  name: string;
  description: string;
  reputationChange: number;
  experienceChange: number;
  charismaChange: number;
  rarity: 'common' | 'uncommon' | 'rare';
};

type GameContextProps = {
  gameState: GameState;
  npcs: NPC[];
  buffCards: BuffCard[];
  selectedCards: BuffCard[];
  movePlayer: (direction: 'up' | 'down' | 'left' | 'right') => void;
  startCombat: (npc: NPC) => void;
  endCombat: (success: boolean) => void;
  selectCard: (card: BuffCard) => void;
  resetCardSelection: () => void;
  restartGame: () => void;
};

// Creating the context with an undefined initial value
const GameContext = createContext<GameContextProps | undefined>(undefined);

// Initial game state
const initialGameState: GameState = {
  reputation: 25,
  experience: 25,
  charisma: 5,
  level: 1,
  playerPosition: { x: 400, y: 300 },
  npcsDefeated: 0,
  inCombat: false,
  currentNpc: null,
  showCardSelection: false,
  gameOver: false,
};

// Sample NPCs for the first level (Networking Event)
const initialNpcs: NPC[] = [
  { id: 1, type: 'Recruiter', position: { x: 200, y: 150 }, defeated: false },
  { id: 2, type: 'Intern', position: { x: 600, y: 200 }, defeated: false },
  { id: 3, type: 'Student', position: { x: 300, y: 450 }, defeated: false },
];

// Sample buff cards
const buffCardsList: BuffCard[] = [
  {
    id: 1,
    name: "Resume Revamp",
    description: "Your resume got a professional makeover. Recruiters are impressed!",
    reputationChange: 10,
    experienceChange: 5,
    charismaChange: 0,
    rarity: 'common',
  },
  {
    id: 2,
    name: "LinkedIn Learning Course",
    description: "You completed a course on the latest tech stack. Knowledge++;",
    reputationChange: 5,
    experienceChange: 15,
    charismaChange: 0,
    rarity: 'common',
  },
  {
    id: 3,
    name: "Public Speaking Workshop",
    description: "You can now speak without sweating profusely. Progress!",
    reputationChange: 5,
    experienceChange: 0,
    charismaChange: 2,
    rarity: 'common',
  },
  {
    id: 4,
    name: "Awkward Handshake",
    description: "That wasn't a fist bump situation. Oops.",
    reputationChange: -5,
    experienceChange: 0,
    charismaChange: -1,
    rarity: 'common',
  },
  {
    id: 5,
    name: "Coffee Spill",
    description: "Right on the interviewer's white shirt. Classic.",
    reputationChange: -10,
    experienceChange: 0,
    charismaChange: 0,
    rarity: 'common',
  },
  {
    id: 6,
    name: "Technical Blog Post",
    description: "Your insights went viral in the dev community!",
    reputationChange: 10,
    experienceChange: 10,
    charismaChange: 1,
    rarity: 'uncommon',
  },
  {
    id: 7,
    name: "Open Source Contribution",
    description: "You fixed that bug everyone was complaining about.",
    reputationChange: 15,
    experienceChange: 15,
    charismaChange: 0,
    rarity: 'uncommon',
  },
  {
    id: 8,
    name: "Conference Talk",
    description: "You didn't pass out on stage. The audience learned something!",
    reputationChange: 10,
    experienceChange: 5,
    charismaChange: 2,
    rarity: 'uncommon',
  },
  {
    id: 9,
    name: "Viral Tweet",
    description: "Your hot take about tabs vs spaces got 10k likes.",
    reputationChange: 5,
    experienceChange: 0,
    charismaChange: 2,
    rarity: 'uncommon',
  },
  {
    id: 10,
    name: "Industry Award",
    description: "They gave you a glass trophy for your code wizardry!",
    reputationChange: 20,
    experienceChange: 15,
    charismaChange: 3,
    rarity: 'rare',
  },
];

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [npcs, setNpcs] = useState<NPC[]>(initialNpcs);
  const [buffCards, setBuffCards] = useState<BuffCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<BuffCard[]>([]);

  // Initialize buff cards when the game starts
  useEffect(() => {
    setBuffCards(buffCardsList);
  }, []);

  // Get two random buff cards for selection
  const getRandomBuffCards = (): BuffCard[] => {
    const availableCards = [...buffCards];
    const selectedCards: BuffCard[] = [];
    
    for (let i = 0; i < 2; i++) {
      if (availableCards.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      selectedCards.push(availableCards[randomIndex]);
      availableCards.splice(randomIndex, 1);
    }
    
    return selectedCards;
  };

  // Player movement function
  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState.inCombat || gameState.showCardSelection || gameState.gameOver) return;

    const { x, y } = gameState.playerPosition;
    let newX = x;
    let newY = y;
    const step = 16; // Pixel movement amount

    switch (direction) {
      case 'up':
        newY = Math.max(0, y - step);
        break;
      case 'down':
        newY = Math.min(568, y + step); // 600 - 32 (character height)
        break;
      case 'left':
        newX = Math.max(0, x - step);
        break;
      case 'right':
        newX = Math.min(768, x + step); // 800 - 32 (character width)
        break;
    }

    setGameState(prev => ({
      ...prev,
      playerPosition: { x: newX, y: newY }
    }));

    // Check for collision with NPCs
    checkNpcCollision(newX, newY);
  };

  // Check if player collides with any NPC
  const checkNpcCollision = (playerX: number, playerY: number) => {
    npcs.forEach(npc => {
      if (!npc.defeated) {
        // Determine hitbox size based on NPC type
        const hitboxSize = npc.type === 'Recruiter' ? 48 : 32;
        
        const distance = Math.sqrt(
          Math.pow(playerX - npc.position.x, 2) + 
          Math.pow(playerY - npc.position.y, 2)
        );
        
        // If player is close enough to NPC, start combat
        if (distance < hitboxSize) {
          startCombat(npc);
        }
      }
    });
  };

  // Start combat with an NPC
  const startCombat = (npc: NPC) => {
    setGameState(prev => ({
      ...prev,
      inCombat: true,
      currentNpc: npc
    }));
  };

  // End combat and show card selection if successful
  const endCombat = (success: boolean) => {
    if (success) {
      // Mark NPC as defeated
      setNpcs(prev => 
        prev.map(npc => 
          npc.id === gameState.currentNpc?.id 
            ? { ...npc, defeated: true } 
            : npc
        )
      );

      // Increase NPC defeat count
      setGameState(prev => ({
        ...prev,
        npcsDefeated: prev.npcsDefeated + 1,
        inCombat: false,
        showCardSelection: true
      }));

      // Get random buff cards for selection
      setSelectedCards(getRandomBuffCards());
    } else {
      // Decrease reputation on failure
      setGameState(prev => {
        const newReputation = Math.max(0, prev.reputation - 10);
        
        // Check for game over
        if (newReputation <= 0) {
          return {
            ...prev,
            reputation: 0,
            inCombat: false,
            gameOver: true
          };
        }
        
        return {
          ...prev,
          reputation: newReputation,
          inCombat: false
        };
      });
    }
  };

  // Select a buff card and apply its effects
  const selectCard = (card: BuffCard) => {
    setGameState(prev => {
      const newGameState = {
        ...prev,
        reputation: Math.min(100, Math.max(0, prev.reputation + card.reputationChange)),
        experience: Math.min(100, Math.max(0, prev.experience + card.experienceChange)),
        charisma: Math.min(10, Math.max(0, prev.charisma + card.charismaChange)),
        showCardSelection: false
      };

      // Check for game over
      if (newGameState.reputation <= 0) {
        return {
          ...newGameState,
          gameOver: true
        };
      }

      return newGameState;
    });
  };

  // Reset card selection
  const resetCardSelection = () => {
    setGameState(prev => ({
      ...prev,
      showCardSelection: false
    }));
  };

  // Restart the game
  const restartGame = () => {
    setGameState(initialGameState);
    setNpcs(initialNpcs);
  };

  return (
    <GameContext.Provider value={{
      gameState,
      npcs,
      buffCards,
      selectedCards,
      movePlayer,
      startCombat,
      endCombat,
      selectCard,
      resetCardSelection,
      restartGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

// Hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
