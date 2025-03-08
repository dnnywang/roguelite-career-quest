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
    
    // Calculate difficulty based on experience
    // Lower experience (1-30) = very easy, (31-60) = easy, (61-100) = moderate
    const difficultyLevel = experience <= 30 ? "very easy" : (experience <= 60 ? "easy" : "moderate");
    
    switch(npcType) {
      case "Recruiter":
        prompt = `You are a tech recruiter having a casual conversation with a job candidate with ${experience} experience points (1-100 scale). Generate a ${difficultyLevel} question about career goals, work preferences, or basic technical skills. The question should be friendly, not overly technical, and only 1-2 sentences long. Example: "What aspects of software development do you enjoy the most?" or "What kind of team environment helps you do your best work?"`;
        break;
      case "Intern":
        prompt = `You are an intern at a tech company chatting with a more experienced colleague (${experience} experience points on 1-100 scale). Ask a ${difficultyLevel}, casual question about coding tips, career advice, or a simple technical concept you're trying to understand. Keep it conversational and friendly. The question should be 1-2 sentences only. Example: "Do you have any tips for learning JavaScript faster?" or "What's your favorite programming language and why?"`;
        break;
      case "Student":
        prompt = `You are a computer science student talking to someone with ${experience} experience points (1-100 scale). Ask a ${difficultyLevel} question about studying tips, project ideas, or simple programming concepts. Make it sound like you're just seeking friendly advice, not testing their knowledge. The question should be 1-2 sentences only. Example: "What programming projects would you recommend for a beginner like me?" or "How do you approach debugging when you're stuck?"`;
        break;
      case "Manager":
        prompt = `You are a tech manager having a casual chat with a team member who has ${experience} experience points (1-100 scale). Ask a ${difficultyLevel} question about project management, collaboration, or general work preferences. Keep it conversational, not like a performance review. The question should be 1-2 sentences only. Example: "What kind of projects do you find most interesting to work on?" or "How do you prefer to receive feedback on your work?"`;
        break;
      case "HR":
        prompt = `You are an HR representative chatting with an employee who has ${experience} experience points (1-100 scale). Ask a ${difficultyLevel}, friendly question about workplace satisfaction, work-life balance, or career development. Keep it conversational and supportive. The question should be 1-2 sentences only. Example: "Is there anything we could do to improve the work environment for you?" or "What skills are you interested in developing in the next year?"`;
        break;
      case "Janitor":
        prompt = `You are a janitor at a tech company chatting with an employee who has ${experience} experience points (1-100 scale). Ask a simple, curious question about their job or technology in general from an outsider's perspective. Keep it very casual and non-technical. The question should be 1-2 sentences only. Example: "I always see people wearing headphones while they code - does music really help with concentration?" or "What exactly does your team work on? I see you all gathered around screens a lot."`;
        break;
      case "Skateboarder":
        prompt = `You are a skateboarder hanging out near a tech company and chatting with someone who works in tech and has ${experience} experience points (1-100 scale). Ask a casual, ${difficultyLevel} question about their job or technology from a curious outsider's perspective. Keep it very informal and beginner-friendly. The question should be 1-2 sentences only. Example: "I heard coding pays well - is it hard to learn?" or "My phone's been acting weird lately - any quick fixes you could suggest?"`;
        break;
      case "Mailman":
        prompt = `You are a mail carrier on your route who regularly delivers to a tech professional with ${experience} experience points (1-100 scale). Ask a friendly, ${difficultyLevel} question about technology or their work from a curious perspective. Keep it conversational and not technical. The question should be 1-2 sentences only. Example: "I've been thinking about getting my kid into coding - any suggestions for where to start?" or "Everyone's talking about AI these days - what's your take on it?"`;
        break;
      case "Civilian":
        prompt = `You are an average person who just met someone who works in tech with ${experience} experience points (1-100 scale). Ask a friendly, ${difficultyLevel} question about their job or technology from a layperson's perspective. Keep it very simple and non-technical. The question should be 1-2 sentences only. Example: "What exactly do you do in your tech job?" or "I'm thinking of switching careers to tech - what would be a good entry point?"`;
        break;
      case "Crackhead":
        prompt = `You are a slightly erratic but harmless person on the street talking to someone with ${experience} experience points (1-100 scale) in tech. Ask a random, somewhat disjointed but ${difficultyLevel} question that's vaguely related to technology or the internet. Keep it weird but not offensive. The question should be 1-2 sentences only. Example: "The internet knows everything, right? How do I delete my brain history?" or "My microwave is spying on me, man - how do I throw it off my trail?"`;
        break;
      case "Robber":
        prompt = `You are a suspicious character who is trying to act casual while talking to someone with ${experience} experience points (1-100 scale) in tech. Ask a ${difficultyLevel} question that seems like small talk but might be fishing for information. Keep it non-threatening and conversational. The question should be 1-2 sentences only. Example: "So what kind of security system do you recommend for homes these days?" or "How much would you say that fancy laptop is worth?"`;
        break;
      case "Policeman":
        prompt = `You are a police officer making casual conversation with a tech professional who has ${experience} experience points (1-100 scale). Ask a ${difficultyLevel} question about cybersecurity, online safety, or how technology works from a law enforcement perspective. Keep it friendly and non-intimidating. The question should be 1-2 sentences only. Example: "What's your advice for protecting personal information online?" or "How do these password manager things actually work?"`;
        break;
      default:
        prompt = `Generate a simple, friendly conversation starter question for someone with ${experience} experience points (1-100 scale) in technology. The question should be easy to answer, non-technical, and only 1-2 sentences long. Focus on personal opinions or experiences rather than technical knowledge.`;
    }
    
    // Add a random seed to ensure we get different questions each time
    const randomSeed = Math.floor(Math.random() * 10000);
    prompt += ` (randomSeed: ${randomSeed})`;
    
    console.log("Gemini API Key exists:", !!geminiApiKey);
    console.log("Sending prompt to Gemini:", prompt);
    
    // Check if API key is available
    if (!geminiApiKey) {
      throw new Error("Gemini API key is not configured");
    }
    
    // Call the Gemini API using v1 instead of v1beta and the gemini-2.0-flash model
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
          temperature: 0.7,
          maxOutputTokens: 100,
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
    console.log("Gemini API response structure:", Object.keys(data));
    
    let generatedQuestion = "";
    
    // Extract the generated text from the response based on v1 API structure
    if (data.candidates && data.candidates[0] && data.candidates[0].content && 
        data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      generatedQuestion = data.candidates[0].content.parts[0].text;
      
      // Clean up the response to ensure it's just a question
      generatedQuestion = generatedQuestion.trim();
      if (generatedQuestion.length > 200) {
        generatedQuestion = generatedQuestion.substring(0, 200) + "...";
      }
      
      console.log("Successfully generated question:", generatedQuestion);
    } else {
      console.error("Unexpected Gemini API response format:", JSON.stringify(data));
      throw new Error("Unexpected response format from Gemini API");
    }
    
    return new Response(JSON.stringify({ question: generatedQuestion }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-question function:', error);
    
    // Provide a different fallback question based on NPC type
    let fallbackQuestion = "What do you enjoy most about working in technology?";
    
    try {
      const { npcType } = await req.json();
      switch(npcType) {
        case "Recruiter":
          fallbackQuestion = "What are you looking for in your next role?";
          break;
        case "Intern":
          fallbackQuestion = "Do you have any advice for someone just starting in tech?";
          break;
        case "Student":
          fallbackQuestion = "What resources would you recommend for learning to code?";
          break;
        case "Manager":
          fallbackQuestion = "How do you prefer to communicate within a team?";
          break;
        case "HR":
          fallbackQuestion = "What do you think makes a good company culture?";
          break;
        case "Janitor":
          fallbackQuestion = "What exactly do you folks do on those computers all day?";
          break;
        case "Skateboarder":
          fallbackQuestion = "Is working in tech as cool as it looks?";
          break;
        case "Mailman":
          fallbackQuestion = "Got any tips for securing my home wifi?";
          break;
        case "Civilian":
          fallbackQuestion = "What's it like working in tech these days?";
          break;
        case "Crackhead":
          fallbackQuestion = "You think computers have feelings, man?";
          break;
        case "Robber":
          fallbackQuestion = "You have any security tips for regular folks?";
          break;
        case "Policeman":
          fallbackQuestion = "What should people do to keep their information safe online?";
          break;
      }
    } catch (e) {
      // Keep the default fallback if we can't parse the request
    }
    
    return new Response(JSON.stringify({ 
      error: error.message,
      fallbackQuestion: fallbackQuestion 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
