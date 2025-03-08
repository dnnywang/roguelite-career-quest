import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, answer, npcType, charisma } = await req.json();
    
    // Create a prompt for evaluation based on the question, answer, and NPC type
    let prompt = `You are an AI evaluating responses in a tech interview game. The player is talking to a "${npcType}" character who asked: "${question}". 

The player responded: "${answer}"

Based on this answer, score it from 1-10 where:
1-3: Poor answer (lacks depth, relevance, or accuracy)
4-6: Average answer (addresses the question but lacks insights or details)
7-8: Good answer (relevant, detailed, and shows understanding)
9-10: Excellent answer (impressive depth, technical accuracy, and articulation)

The player's charisma level is ${charisma}, which is the threshold they need to meet or exceed to succeed.

Provide your evaluation in JSON format with the following structure:
{
  "score": [numerical score between 1-10],
  "success": [boolean indicating if score >= charisma],
  "feedback": [1-2 sentence feedback explaining the score]
}`;
    
    console.log("Gemini API Key exists:", !!geminiApiKey);
    
    // Check if API key is available
    if (!geminiApiKey) {
      throw new Error("Gemini API key is not configured");
    }
    
    // Call the Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + geminiApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 150,
        }
      })
    });
    
    // Log HTTP status for debugging
    console.log("Gemini API HTTP Status:", response.status);
    
    // Handle non-200 responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API returned ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    let evaluationText = "";
    
    // Extract the generated text from the response
    if (data.candidates && data.candidates[0] && data.candidates[0].content && 
        data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      evaluationText = data.candidates[0].content.parts[0].text;
      console.log("Raw evaluation response:", evaluationText);
    } else {
      console.error("Unexpected Gemini API response format:", JSON.stringify(data));
      throw new Error("Unexpected response format from Gemini API");
    }
    
    // Try to extract JSON from the response
    let evaluationJson = null;
    try {
      // Find JSON content within the text using regex
      const jsonMatch = evaluationText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluationJson = JSON.parse(jsonMatch[0]);
        
        // Ensure the success property is correctly set based on the INVERTED charisma threshold
        // Higher charisma means LOWER threshold (e.g., charisma 7 means threshold is 3)
        const invertedThreshold = 10 - charisma;
        evaluationJson.success = evaluationJson.score >= invertedThreshold;
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (jsonError) {
      console.error("Error parsing evaluation JSON:", jsonError);
      // Fallback evaluation
      evaluationJson = {
        score: Math.min(10, Math.max(1, Math.floor(answer.length / 20))),
        feedback: "Unable to provide detailed feedback. Try giving a more comprehensive answer."
      };
      
      // Check if score meets inverted threshold for success
      const invertedThreshold = 10 - charisma;
      evaluationJson.success = evaluationJson.score >= invertedThreshold;
    }
    
    return new Response(JSON.stringify(evaluationJson), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in evaluate-answer function:', error);
    
    // Fallback evaluation with a simple algorithm
    try {
      const { answer, charisma } = await req.json();
      
      // Simple scoring based on answer length and complexity
      const answerLength = answer.length;
      const wordCount = answer.split(' ').length;
      const hasCodeExample = answer.includes('code') || answer.includes('function') || answer.includes('const');
      const hasTechnicalTerms = answer.includes('API') || answer.includes('algorithm') || answer.includes('React');
      
      // Calculate a score from 1-10
      let score = Math.min(10, Math.max(1, Math.floor(answerLength / 20) + (wordCount / 5) + 
                         (hasCodeExample ? 2 : 0) + (hasTechnicalTerms ? 2 : 0)));
      
      // Check against inverted charisma threshold
      const invertedThreshold = 10 - charisma;
      const success = score >= invertedThreshold;
      
      return new Response(JSON.stringify({ 
        score: score,
        success: success,
        feedback: success ? "Your response shows good understanding." : "Your answer lacks sufficient depth or detail.",
        fallback: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (e) {
      // Last resort fallback if we can't even parse the parameters
      return new Response(JSON.stringify({ 
        error: error.message,
        score: 5, // Neutral score as absolute fallback
        success: 5 >= (typeof charisma === 'number' ? (10 - charisma) : 5), // Using inverted threshold
        feedback: "An error occurred during evaluation.",
        fallback: true
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }
}); 