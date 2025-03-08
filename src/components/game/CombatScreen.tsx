
import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const CombatScreen: React.FC = () => {
  const { gameState, endCombat } = useGame();
  const { currentNpc, charisma, experience } = gameState;
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  // Get color based on NPC type
  const getNpcColor = () => {
    switch (currentNpc?.type) {
      case 'Recruiter':
        return 'bg-blue-500';
      case 'Intern':
        return 'bg-green-500';
      case 'Student':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Mock questions based on NPC type
  const getQuestion = () => {
    switch (currentNpc?.type) {
      case 'Recruiter':
        return `Based on your ${experience} experience points: Explain the difference between REST and GraphQL APIs.`;
      case 'Intern':
        return `Based on your ${experience} experience points: What is the purpose of React's useEffect hook?`;
      case 'Student':
        return `Based on your ${experience} experience points: Explain the concept of Big O notation in algorithm complexity.`;
      default:
        return "What is your approach to learning new technologies?";
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    
    setSubmitted(true);
    
    // Simulate AI evaluation (in the real app, this would call the Gemini API)
    setTimeout(() => {
      // Calculate a score based on answer length and complexity
      // This is just for demo - the real app would use Gemini API
      const answerLength = answer.length;
      const wordCount = answer.split(' ').length;
      const hasCodeExample = answer.includes('code') || answer.includes('function') || answer.includes('const');
      const hasTechnicalTerms = answer.includes('API') || answer.includes('algorithm') || answer.includes('React');
      
      // Calculate a score from 1-10
      let score = Math.min(10, Math.max(1, Math.floor(answerLength / 20) + (wordCount / 5) + 
                         (hasCodeExample ? 2 : 0) + (hasTechnicalTerms ? 2 : 0)));
      
      // Check if score meets or exceeds the charisma threshold
      const success = score >= charisma;
      
      if (success) {
        toast.success("Great answer! The NPC was impressed.");
      } else {
        toast.error(`Your answer scored ${score}, but needed ${charisma} to succeed.`);
      }
      
      // End combat after a short delay to allow the user to see the result
      setTimeout(() => {
        endCombat(success);
        setAnswer('');
        setSubmitted(false);
      }, 2000);
    }, 1500);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <div className="mb-6 flex items-center">
          <div className={`w-16 h-16 mr-4 ${getNpcColor()} rounded-md flex items-center justify-center`}>
            <span className="text-white font-bold">{currentNpc?.type}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">{currentNpc?.type} Challenge</h2>
            <p className="text-game-gray">Charisma threshold: {charisma}/10</p>
          </div>
        </div>
        
        <div className="bg-game-light-gray p-4 rounded-md mb-6">
          <p className="mb-2 font-semibold">Question:</p>
          <p>{getQuestion()}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="answer" className="block mb-2 font-semibold">
              Your Answer:
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitted}
              className="w-full p-2 border border-gray-300 rounded-md h-32"
              placeholder="Type your answer here..."
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={submitted} className="bg-game-blue hover:bg-game-dark-blue">
              {submitted ? "Evaluating..." : "Submit Answer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CombatScreen;
