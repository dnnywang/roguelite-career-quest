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
  movePlayer: (direction: 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right') => void;
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
  playerPosition: { 
    x: window.innerWidth * 0.95 * 0.5 - 96, 
    y: window.innerHeight * 0.85 * 0.5 - 96 
  },
  npcsDefeated: 0,
  inCombat: false,
  currentNpc: null,
  showCardSelection: false,
  gameOver: false,
};

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

// Generate NPCs for a specific level with random positions
const generateNpcsForLevel = (level: number): NPC[] => {
  // Get viewport dimensions for positioning
  const viewportWidth = window.innerWidth * 0.95;
  const viewportHeight = window.innerHeight * 0.85;
  
  // Minimum distance between NPCs to avoid overlap
  const minDistance = 150;
  
  // Create an array to hold our NPC definitions for the level
  let npcTypes: { id: number, type: string }[] = [];
  
  // Define NPC types for each level
  switch (level) {
    case 1: // Networking Event
      npcTypes = [
        { id: 1, type: 'Recruiter' },
        { id: 2, type: 'Intern' },
        { id: 3, type: 'Student' }
      ];
      break;
    case 2: // Office
      npcTypes = [
        { id: 4, type: 'Manager' },
        { id: 5, type: 'HR' },
        { id: 6, type: 'Janitor' }
      ];
      break;
    case 3: // SF Street
      npcTypes = [
        { id: 7, type: 'Skateboarder' },
        { id: 8, type: 'Mailman' },
        { id: 9, type: 'Civilian' }
      ];
      break;
    case 4: // Sewer
      npcTypes = [
        { id: 10, type: 'Crackhead' },
        { id: 11, type: 'Robber' },
        { id: 12, type: 'Policeman' }
      ];
      break;
    default:
      return [];
  }
  
  // Create NPCs with random positions
  const npcs: NPC[] = [];
  const maxAttempts = 100; // Maximum attempts to find a valid position
  
  for (const npcType of npcTypes) {
    // NPC size based on type (same logic as in checkNpcCollision)
    const npcSize = npcType.type === 'Recruiter' ? 192 : 
                   (npcType.type === 'Manager' || npcType.type === 'HR') ? 172 : 144;
    
    // Try to find a valid position
    let validPosition = false;
    let attempts = 0;
    let newNpcX = 0;
    let newNpcY = 0;
    
    while (!validPosition && attempts < maxAttempts) {
      attempts++;
      
      // Generate random position with padding to keep away from edges
      const padding = npcSize;
      newNpcX = Math.floor(padding + Math.random() * (viewportWidth - npcSize - padding * 2));
      newNpcY = Math.floor(padding + Math.random() * (viewportHeight - npcSize - padding * 2));
      
      // Check if this position overlaps with any existing NPC
      validPosition = true;
      for (const existingNpc of npcs) {
        // Get existing NPC size
        const existingNpcSize = existingNpc.type === 'Recruiter' ? 192 : 
                              (existingNpc.type === 'Manager' || existingNpc.type === 'HR') ? 172 : 144;
        
        // Calculate distance between centers
        const centerDistance = Math.sqrt(
          Math.pow((newNpcX + npcSize/2) - (existingNpc.position.x + existingNpcSize/2), 2) +
          Math.pow((newNpcY + npcSize/2) - (existingNpc.position.y + existingNpcSize/2), 2)
        );
        
        // Check if NPCs are too close
        if (centerDistance < (npcSize + existingNpcSize) / 2 + minDistance) {
          validPosition = false;
          break;
        }
      }
      
      // Also check distance from player starting position (center of screen)
      const playerStartX = viewportWidth * 0.5 - 96;
      const playerStartY = viewportHeight * 0.5 - 96;
      const playerSize = 192;
      
      const distanceFromPlayer = Math.sqrt(
        Math.pow((newNpcX + npcSize/2) - (playerStartX + playerSize/2), 2) +
        Math.pow((newNpcY + npcSize/2) - (playerStartY + playerSize/2), 2)
      );
      
      // Ensure NPCs aren't too close to player starting position
      if (distanceFromPlayer < (npcSize + playerSize) / 2 + minDistance * 2) {
        validPosition = false;
      }
    }
    
    // If we couldn't find a valid position after max attempts, use a fallback position
    // based on the NPC index to ensure they're at least somewhat spread out
    if (!validPosition) {
      const index = npcs.length;
      const segmentWidth = viewportWidth / 4;
      const segmentHeight = viewportHeight / 3;
      
      newNpcX = (index % 4) * segmentWidth + segmentWidth / 2 - npcSize / 2;
      newNpcY = Math.floor(index / 4) * segmentHeight + segmentHeight / 2 - npcSize / 2;
    }
    
    // Add NPC with the determined position
    npcs.push({
      id: npcType.id,
      type: npcType.type,
      position: { x: newNpcX, y: newNpcY },
      defeated: false
    });
  }
  
  return npcs;
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  // Initialize NPCs with an empty array first
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [buffCards, setBuffCards] = useState<BuffCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<BuffCard[]>([]);

  // Initialize buff cards and generate NPCs when the component mounts
  useEffect(() => {
    setBuffCards(buffCardsList);
    // Generate NPCs with random positions for level 1
    setNpcs(generateNpcsForLevel(1));
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

  // Player movement function with diagonal support
  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right') => {
    if (gameState.inCombat || gameState.showCardSelection || gameState.gameOver) return;

    const { x, y } = gameState.playerPosition;
    let newX = x;
    let newY = y;
    const step = 25; // Increased for even faster movement
    const diagonalStep = Math.floor(step * 0.707); // Approximately step * sin(45°) for diagonal movement
    const playerSize = 192; // Player sprite size

    // Calculate new position based on direction
    switch (direction) {
      case 'up':
        newY = Math.max(0, y - step);
        break;
      case 'down':
        newY = Math.min(window.innerHeight * 0.85 - playerSize, y + step);
        break;
      case 'left':
        newX = Math.max(0, x - step);
        break;
      case 'right':
        newX = Math.min(window.innerWidth * 0.95 - playerSize, x + step);
        break;
      case 'up-left':
        newY = Math.max(0, y - diagonalStep);
        newX = Math.max(0, x - diagonalStep);
        break;
      case 'up-right':
        newY = Math.max(0, y - diagonalStep);
        newX = Math.min(window.innerWidth * 0.95 - playerSize, x + diagonalStep);
        break;
      case 'down-left':
        newY = Math.min(window.innerHeight * 0.85 - playerSize, y + diagonalStep);
        newX = Math.max(0, x - diagonalStep);
        break;
      case 'down-right':
        newY = Math.min(window.innerHeight * 0.85 - playerSize, y + diagonalStep);
        newX = Math.min(window.innerWidth * 0.95 - playerSize, x + diagonalStep);
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
        const hitboxSize = npc.type === 'Recruiter' ? 192 : 
                         (npc.type === 'Manager' || npc.type === 'HR') ? 172 : 144;
        
        const playerSize = 192;
        const collisionDistance = (hitboxSize + playerSize) / 2.5; // Adjusted for sprites
        
        const distance = Math.sqrt(
          Math.pow(playerX + playerSize/2 - (npc.position.x + hitboxSize/2), 2) + 
          Math.pow(playerY + playerSize/2 - (npc.position.y + hitboxSize/2), 2)
        );
        
        // If player is close enough to NPC, start combat
        if (distance < collisionDistance) {
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

  // End combat with an NPC
  const endCombat = (success: boolean) => {
    if (gameState.currentNpc) {
      if (success) {
        // Mark NPC as defeated
        const updatedNpcs = npcs.map(npc => 
          npc.id === gameState.currentNpc?.id 
            ? { ...npc, defeated: true } 
            : npc
        );
        setNpcs(updatedNpcs);
        
        // Increment npcsDefeated counter
        const newNpcsDefeated = gameState.npcsDefeated + 1;
        
        // Get level-based NPC ID range
        const levelStartId = (gameState.level - 1) * 3 + 1;
        const levelEndId = gameState.level * 3;
        
        // Get all existing NPCs for the current level
        const npcsForCurrentLevel = updatedNpcs.filter(npc => 
          npc.id >= levelStartId && npc.id <= levelEndId
        );
        
        // Check if all NPCs on the current level are defeated
        // Only proceed if there's at least one NPC on this level
        const allNpcsDefeatedOnLevel = 
          npcsForCurrentLevel.length > 0 && 
          npcsForCurrentLevel.every(npc => npc.defeated);
        
        console.log(`Level ${gameState.level}: Found ${npcsForCurrentLevel.length} NPCs, all defeated: ${allNpcsDefeatedOnLevel}`);
        
        // Determine if we should level up
        let newLevel = gameState.level;
        if (allNpcsDefeatedOnLevel) {
          // If all NPCs on the current level are defeated, move to the next level
          newLevel = gameState.level + 1;
          
          // Cap at level 4 (Sewer level)
          if (newLevel > 4) {
            newLevel = 4;
          }
        }
        
        // If level changed, generate new NPCs for the level
        if (newLevel > gameState.level) {
          const newNpcs = generateNpcsForLevel(newLevel);
          setNpcs(newNpcs);
        }
        
        // Update game state
        setGameState(prev => ({
          ...prev,
          inCombat: false,
          currentNpc: null,
          showCardSelection: true,
          npcsDefeated: newNpcsDefeated,
          level: newLevel
        }));
        
        // Set selected cards for buff selection
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
              currentNpc: null,
              gameOver: true
            };
          }
          
          return {
            ...prev,
            reputation: newReputation,
            inCombat: false,
            currentNpc: null
          };
        });
      }
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
    // Reset game state
    setGameState(initialGameState);
    // Generate new NPCs with random positions
    setNpcs(generateNpcsForLevel(1));
    // Reset buff cards and selection
    setSelectedCards([]);
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
