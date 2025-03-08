import React, { useEffect, useState, useRef } from 'react';
import { useGame } from '@/contexts/GameContext';

const Player: React.FC = () => {
  const { gameState, movePlayer } = useGame();
  const { playerPosition } = gameState;
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  
  // Directly track key states without relying on browser key repeat
  const keyMap = useRef<{[key: string]: boolean}>({
    w: false,
    a: false,
    s: false,
    d: false,
    arrowup: false,
    arrowleft: false,
    arrowdown: false,
    arrowright: false
  });
  
  // Movement interval ID
  const moveIntervalRef = useRef<number | null>(null);
  
  // Separate utility function for checking if we're in a text input
  const isInInputField = () => {
    const activeElement = document.activeElement;
    return (
      activeElement instanceof HTMLInputElement || 
      activeElement instanceof HTMLTextAreaElement || 
      activeElement?.getAttribute('role') === 'textbox'
    );
  };
  
  // Process movement based on current key states
  const processMovement = () => {
    // Skip movement if in a text input
    if (isInInputField()) return;
    
    // Get current key states
    const w = keyMap.current.w || keyMap.current.arrowup;
    const a = keyMap.current.a || keyMap.current.arrowleft;
    const s = keyMap.current.s || keyMap.current.arrowdown;
    const d = keyMap.current.d || keyMap.current.arrowright;
    
    // Update direction based on horizontal keys
    if (a && !d) setDirection('left');
    if (d && !a) setDirection('right');
    
    // Determine which direction to move based on key combinations
    if (w && a && !s && !d) {
      movePlayer('up-left');
    } else if (w && d && !s && !a) {
      movePlayer('up-right');
    } else if (s && a && !w && !d) {
      movePlayer('down-left');
    } else if (s && d && !w && !a) {
      movePlayer('down-right');
    } else if (w && !s && !a && !d) {
      movePlayer('up');
    } else if (s && !w && !a && !d) {
      movePlayer('down');
    } else if (a && !w && !s && !d) {
      movePlayer('left');
    } else if (d && !w && !s && !a) {
      movePlayer('right');
    }
  };
  
  // Start or ensure movement interval is running
  const ensureMovementInterval = () => {
    // Clear any existing interval first
    if (moveIntervalRef.current !== null) {
      clearInterval(moveIntervalRef.current);
    }
    
    // Start a new interval
    moveIntervalRef.current = window.setInterval(processMovement, 16); // ~60fps
    
    // Process movement immediately for instant response
    processMovement();
  };
  
  // Check if any movement keys are pressed
  const isAnyMovementKeyPressed = () => {
    return Object.values(keyMap.current).some(pressed => pressed);
  };
  
  // Set up keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Only handle our tracked keys
      if (!(key in keyMap.current)) {
        return;
      }
      
      // Prevent default for arrow keys to prevent scrolling
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
      }
      
      // Skip if in input field and using WASD
      if (isInInputField() && ['w', 'a', 's', 'd'].includes(key)) {
        return;
      }
      
      // Update key state
      keyMap.current[key] = true;
      
      // Ensure the movement interval is running
      ensureMovementInterval();
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Only handle our tracked keys
      if (!(key in keyMap.current)) {
        return;
      }
      
      // Update key state
      keyMap.current[key] = false;
      
      // If no movement keys are pressed, clear the interval
      if (!isAnyMovementKeyPressed()) {
        if (moveIntervalRef.current !== null) {
          clearInterval(moveIntervalRef.current);
          moveIntervalRef.current = null;
        }
      }
    };
    
    const handleBlur = () => {
      // Reset all key states
      Object.keys(keyMap.current).forEach(key => {
        keyMap.current[key] = false;
      });
      
      // Clear the movement interval
      if (moveIntervalRef.current !== null) {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
      }
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      
      if (moveIntervalRef.current !== null) {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
      }
    };
  }, [movePlayer]);
  
  return (
    <div className="relative">
      {/* Player name label positioned above the sprite */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 -top-6 text-[10px] text-white font-bold text-center px-1 py-0.5 bg-black bg-opacity-50 rounded-sm"
        style={{
          width: '25px',
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
          width: '192px',
          height: '192px',
          backgroundImage: 'url(https://cdn.discordapp.com/attachments/1338984226766458932/1347817294041976872/1.png?ex=67cd342c&is=67cbe2ac&hm=43f5d1cab692d85e462d4079be56e992671da03106328a584ebe5e3fecb9f8df&)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
          transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)'
        }}
      />
    </div>
  );
};

export default Player;
