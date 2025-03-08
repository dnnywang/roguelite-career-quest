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
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{score: number; text: string; success: boolean} | null>(null);
  
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
  
  // Get NPC description based on type
  const getNpcDescription = () => {
    switch (currentNpc?.type) {
      case 'Recruiter':
        return 'This tech recruiter is evaluating your technical expertise. Higher charisma means you need less technical precision to impress them.';
      case 'Intern':
        return 'This junior developer is eager to learn from your experience. Higher charisma means you can be less detailed but still be helpful.';
      case 'Student':
        return 'This computer science student is seeking guidance. Higher charisma means your explanations can be simpler while still being effective.';
      default:
        return 'A tech professional wants to test your knowledge. Higher charisma means you need less technical depth to succeed.';
    }
  };
  
  // Fetch question from Gemini API when component mounts or when NPC changes
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!currentNpc) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Generate a timestamp to ensure a fresh question each time
        const timestamp = new Date().getTime();
        
        const { data, error } = await supabase.functions.invoke('generate-question', {
          body: { 
            npcType: currentNpc.type,
            experience: experience,
            timestamp: timestamp  // Send timestamp to ensure unique requests
          }
        });
        
        if (error) {
          console.error('Error from Supabase function:', error);
          setError(`Error: ${error.message}`);
          
          if (data && data.fallbackQuestion) {
            setQuestion(data.fallbackQuestion);
            toast.error("Using fallback question. The AI service is currently unavailable.");
          } else {
            setQuestion(`Based on your ${experience} experience points: What is your approach to learning new technologies?`);
          }
        } else if (data && data.question) {
          setQuestion(data.question);
        } else if (data && data.fallbackQuestion) {
          setQuestion(data.fallbackQuestion);
          setError("The AI service returned an unexpected response format.");
          toast.error("Using fallback question. The AI service is currently unavailable.");
        } else {
          setError("Received empty response from the server.");
          setQuestion(`Based on your ${experience} experience points: What is your approach to learning new technologies?`);
        }
      } catch (err) {
        console.error('Failed to fetch question:', err);
        setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setQuestion(`Based on your ${experience} experience points: What is your approach to learning new technologies?`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuestion();
  }, [currentNpc, experience]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    
    setSubmitted(true);
    setIsLoading(true);
    setFeedback(null);
    
    try {
      // Call the Supabase function to evaluate the answer using Gemini API
      const { data, error } = await supabase.functions.invoke('evaluate-answer', {
        body: { 
          question: question,
          answer: answer,
          npcType: currentNpc?.type,
          charisma: charisma
        }
      });
      
      if (error) {
        console.error('Error from Supabase function:', error);
        toast.error(`Evaluation failed: ${error.message}`);
        
        // Use fallback evaluation
        const answerLength = answer.length;
        const wordCount = answer.split(' ').length;
        const hasCodeExample = answer.includes('code') || answer.includes('function') || answer.includes('const');
        const hasTechnicalTerms = answer.includes('API') || answer.includes('algorithm') || answer.includes('React');
        
        // Calculate a score from 1-10
        let score = Math.min(10, Math.max(1, Math.floor(answerLength / 20) + (wordCount / 5) + 
                           (hasCodeExample ? 2 : 0) + (hasTechnicalTerms ? 2 : 0)));
        
        // Invert charisma threshold: higher charisma means lower threshold
        const invertedThreshold = 10 - charisma;
        const success = score >= invertedThreshold;
        
        const fallbackFeedback = success ? 
          "Your answer was accepted based on length and complexity." : 
          "Your answer needs more detail and technical information.";
        
        setFeedback({
          score: score,
          text: `${fallbackFeedback} (Fallback evaluation)`,
          success: success
        });
        
        // End combat after a short delay
        setTimeout(() => {
          endCombat(success);
          setAnswer('');
          setSubmitted(false);
          setIsLoading(false);
          setFeedback(null);
        }, 4000);
        
        return;
      }
      
      // Process the evaluation result
      if (data) {
        const { score, success: apiSuccess, feedback: feedbackText, fallback } = data;
        
        // Invert charisma threshold: higher charisma means lower threshold
        // Example: charisma 7/10 means threshold is 3/10 (10 - 7)
        const invertedThreshold = 10 - charisma;
        const success = score >= invertedThreshold;
        
        if (fallback) {
          toast.warning("Using fallback evaluation algorithm.");
        }
        
        setFeedback({
          score: score,
          text: feedbackText + (fallback ? " (Fallback evaluation)" : ""),
          success: success
        });
        
        // End combat after a delay to allow the user to read the feedback
        setTimeout(() => {
          endCombat(success);
          setAnswer('');
          setSubmitted(false);
          setIsLoading(false);
          setFeedback(null);
        }, 4000);
      } else {
        throw new Error("Received empty response from the server");
      }
    } catch (err) {
      console.error('Failed to evaluate answer:', err);
      toast.error(`Evaluation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      
      // Use a simple fallback evaluation
      const answerLength = answer.length;
      const wordCount = answer.split(' ').length;
      const hasCodeExample = answer.includes('code') || answer.includes('function') || answer.includes('const');
      const hasTechnicalTerms = answer.includes('API') || answer.includes('algorithm') || answer.includes('React');
      
      // Calculate a score from 1-10
      let score = Math.min(10, Math.max(1, Math.floor(answerLength / 20) + (wordCount / 5) + 
                         (hasCodeExample ? 2 : 0) + (hasTechnicalTerms ? 2 : 0)));
      
      // Invert charisma threshold: higher charisma means lower threshold
      const invertedThreshold = 10 - charisma;
      const success = score >= invertedThreshold;
      
      setFeedback({
        score: score,
        text: "Unable to provide detailed feedback. (Local fallback evaluation)",
        success: success
      });
      
      // End combat after a delay
      setTimeout(() => {
        endCombat(success);
        setAnswer('');
        setSubmitted(false);
        setIsLoading(false);
        setFeedback(null);
      }, 4000);
    }
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
            <p className="text-game-gray">Challenge difficulty: {10 - charisma}/10 (Your charisma: {charisma}/10)</p>
            <p className="text-sm text-gray-600 mt-1">{getNpcDescription()}</p>
          </div>
        </div>
        
        <div className="bg-game-light-gray p-4 rounded-md mb-6">
          <p className="mb-2 font-semibold">Question:</p>
          {isLoading && !submitted ? (
            <div className="animate-pulse">Loading question...</div>
          ) : (
            <p>{question}</p>
          )}
          {error && !isLoading && (
            <p className="text-red-500 text-sm mt-2">
              Note: Using fallback question due to API issue.
            </p>
          )}
        </div>
        
        {feedback && (
          <div className={`p-4 rounded-md mb-6 ${feedback.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">
                {feedback.success ? 'Success!' : 'Not quite...'}
              </h3>
              <div className="text-sm font-medium">
                Score: <span className={`font-bold ${feedback.success ? 'text-green-600' : 'text-red-600'}`}>
                  {feedback.score}/10
                </span>
                {feedback.success ? ' ✓' : ` (needed ${10 - charisma})`}
              </div>
            </div>
            <p className="text-sm">{feedback.text}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="answer" className="block mb-2 font-semibold">
              Your Answer:
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitted || (isLoading && !submitted)}
              className="w-full p-2 border border-gray-300 rounded-md h-32"
              placeholder={(isLoading && !submitted) ? "Waiting for question..." : "Type your answer here..."}
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={submitted || (isLoading && !submitted)} 
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
