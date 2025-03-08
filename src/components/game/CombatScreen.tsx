
import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

const CombatScreen: React.FC = () => {
  const { gameState, endCombat } = useGame();
  const { currentNpc, charisma, experience } = gameState;
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [question, setQuestion] = useState('Loading question...');
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  // Fetch question from Gemini API when component mounts
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!currentNpc) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('generate-question', {
          body: { 
            npcType: currentNpc.type,
            experience: experience
          }
        });
        
        if (error) {
          console.error('Error fetching question:', error);
          setQuestion(`Based on your ${experience} experience points: What is your approach to learning new technologies?`);
        } else if (data && data.question) {
          setQuestion(data.question);
        } else if (data && data.fallbackQuestion) {
          setQuestion(data.fallbackQuestion);
        }
      } catch (err) {
        console.error('Failed to fetch question:', err);
        setQuestion(`Based on your ${experience} experience points: What is your approach to learning new technologies?`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuestion();
  }, [currentNpc, experience]);
  
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
          {isLoading ? (
            <div className="animate-pulse">Loading question...</div>
          ) : (
            <p>{question}</p>
          )}
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
              disabled={submitted || isLoading}
              className="w-full p-2 border border-gray-300 rounded-md h-32"
              placeholder={isLoading ? "Waiting for question..." : "Type your answer here..."}
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={submitted || isLoading} 
              className="bg-game-blue hover:bg-game-dark-blue"
            >
              {submitted ? "Evaluating..." : "Submit Answer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CombatScreen;
