# Supabase Functions for Roguelite Career Quest

This directory contains Supabase Edge Functions that power the AI capabilities of the game.

## Functions Overview

1. **generate-question** - Generates technical interview questions based on NPC type and player experience level.
2. **evaluate-answer** - Evaluates player answers to questions using AI, providing scores and feedback.

## Setup Instructions

### Prerequisites

1. Make sure you have the Supabase CLI installed:
   ```bash
   npm install -g supabase
   ```

2. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Local Development

1. Set up local secrets:
   ```bash
   supabase secrets set GEMINI_API_KEY=your_gemini_api_key
   ```

2. Start the functions locally:
   ```bash
   supabase functions serve
   ```

### Deployment

1. Link your project (if not already linked):
   ```bash
   supabase link --project-ref your-project-ref
   ```

2. Set the Gemini API key as a secret on your Supabase project:
   ```bash
   supabase secrets set GEMINI_API_KEY=your_gemini_api_key
   ```

3. Deploy the functions:
   ```bash
   supabase functions deploy generate-question
   supabase functions deploy evaluate-answer
   ```

## Usage

### generate-question

This function generates interview questions based on NPC type and player experience:

```typescript
const { data, error } = await supabase.functions.invoke('generate-question', {
  body: { 
    npcType: "Recruiter", // or "Intern", "Student", etc.
    experience: 50,       // Player's experience level (1-100)
    timestamp: Date.now() // To ensure unique questions
  }
});

if (data && data.question) {
  console.log(data.question);
}
```

### evaluate-answer

This function evaluates player answers and provides scores and feedback:

```typescript
const { data, error } = await supabase.functions.invoke('evaluate-answer', {
  body: { 
    question: "What is your approach to debugging complex issues?",
    answer: "My detailed answer...",
    npcType: "Recruiter",
    charisma: 7  // Min score needed to succeed (1-10)
  }
});

if (data) {
  const { score, success, feedback } = data;
  console.log(`Score: ${score}/10, Success: ${success}, Feedback: ${feedback}`);
}
```

## Error Handling

Both functions have built-in fallback mechanisms in case the Gemini API is unavailable:

- **generate-question** will provide fallback questions based on NPC type
- **evaluate-answer** uses a simple algorithm based on answer length, word count, and keyword detection

## Troubleshooting

If you encounter issues:

1. Check that your Gemini API key is correctly set as a secret
2. Verify that the function deployment was successful
3. Check Supabase logs: `supabase functions logs`
4. Ensure your project is on an appropriate plan to use Edge Functions 