
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
    const { npcType, experience } = await req.json();
    
    // Create a prompt based on the NPC type and player's experience
    let prompt = "";
    
    switch(npcType) {
      case "Recruiter":
        prompt = `You are a tech recruiter interviewing a candidate with ${experience} experience points. Generate a challenging but appropriate technical interview question about software development, algorithms, system design, or leadership. Focus on questions that assess problem-solving skills and expertise. The question should be 1-2 sentences only.`;
        break;
      case "Intern":
        prompt = `You are an intern at a tech company talking to someone with ${experience} experience points. Ask them a beginner-friendly question about React, JavaScript, CSS, or modern web development tools that you're genuinely curious about as someone new to the industry. The question should be casual and reflect your junior status. The question should be 1-2 sentences only.`;
        break;
      case "Student":
        prompt = `You are a computer science student talking to someone with ${experience} experience points. Ask them a theoretical question about algorithms, data structures, computer science principles, or academic concepts that you're struggling with in your coursework. Make it sound like you're looking for guidance from someone more experienced. The question should be 1-2 sentences only.`;
        break;
      default:
        prompt = `Generate a general technical interview question for someone with ${experience} experience points. The question should be 1-2 sentences only.`;
    }
    
    console.log("Sending prompt to Gemini:", prompt);
    
    // Call the Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + geminiApiKey, {
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
          temperature: 0.7,
          maxOutputTokens: 100,
        }
      })
    });
    
    const data = await response.json();
    console.log("Gemini API response:", JSON.stringify(data));
    
    let generatedQuestion = "";
    
    // Extract the generated text from the response
    if (data.candidates && data.candidates[0] && data.candidates[0].content && 
        data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      generatedQuestion = data.candidates[0].content.parts[0].text;
      
      // Clean up the response to ensure it's just a question
      generatedQuestion = generatedQuestion.trim();
      if (generatedQuestion.length > 200) {
        generatedQuestion = generatedQuestion.substring(0, 200) + "...";
      }
    } else {
      throw new Error("Unexpected response format from Gemini API");
    }
    
    return new Response(JSON.stringify({ question: generatedQuestion }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-question function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallbackQuestion: "What is your approach to learning new technologies?" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
