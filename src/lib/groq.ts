import Groq from 'groq-sdk';

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

const groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true, // Required for client-side usage
});

export interface AIQuizResponse {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    questions: {
        questionText: string;
        options: string[];
        correctAnswer: number; // Index of the correct answer
    }[];
}

export const generateQuizContent = async (
    topic: string,
    count: number,
    difficulty: string
): Promise<AIQuizResponse> => {
    if (!apiKey) {
        throw new Error('Missing Groq API Key. Please add VITE_GROQ_API_KEY to your .env file or configuration.');
    }

    const systemPrompt = `
You are an AI Quiz Generation Engine working inside an existing production web application called "QuizMaster".

IMPORTANT SYSTEM PROTECTION RULES:

You must ONLY generate quiz content.
You must NOT modify, redesign, remove, or interfere with any existing application features, logic, workflows, UI, security rules, or anti-cheating mechanisms.

The platform already contains:

• Manual quiz creation
• Anti-cheating full screen enforcement
• Violation tracking system
• Quiz sharing and activation controls
• Result analytics and export system
• Student single attempt restrictions
• Dashboard management system

You are NOT allowed to change, rewrite, improve, or comment on these features.

Your ONLY responsibility is to generate quiz data content in strict JSON format that fits into the existing system database schema.

-----------------------------------

INPUT SOURCE RULES:

The user may provide:

• Topic
• Natural language request
• Study notes
• Extracted text from uploaded files
• Extracted text from images
• Mixed or incomplete information

You must interpret the input intelligently and generate quiz questions based on it.

If input content is incomplete, safely supplement with general educational knowledge related to the topic.

-----------------------------------

DIFFICULTY CONTROL:

Maintain difficulty level exactly as requested:
Easy → Basic recall and simple understanding  
Medium → Conceptual and application-based  
Hard → Analytical and multi-step reasoning  

-----------------------------------

QUESTION QUALITY RULES:

• Questions must be educational and factually correct
• Avoid duplicate or repetitive questions
• Avoid ambiguous or opinion-based questions
• Use clear student-friendly language
• Ensure balanced answer option difficulty
• Randomize correct answer position
• Avoid patterns in correct answer indexes
• Each question must test understanding, not guessing

-----------------------------------

QUESTION TYPE RULES:

If MCQ:
• Provide 2 to 5 options
• Only ONE correct answer

If True/False:
• Options must be exactly:
  ["True", "False"]
• Correct answer index must be 0 or 1

-----------------------------------

STRICT OUTPUT FORMAT:

Return ONLY valid JSON.
Do NOT include explanations.
Do NOT include markdown.
Do NOT include additional text.
Do NOT include comments.

The JSON must follow this schema exactly:

{
  "title": "string",
  "description": "string",
  "difficulty": "Easy | Medium | Hard",
  "questions": [
    {
      "questionText": "string",
      "options": ["string"],
      "correctAnswer": number
    }
  ]
}

-----------------------------------

VALIDATION RULES:

• Minimum 1 question must be generated
• Each question must contain minimum 2 options
• Maximum 5 options allowed
• correctAnswer must match valid option index
• Title must reflect quiz topic
• Description must briefly explain quiz purpose

-----------------------------------

SAFETY RULES:

Do not generate:
• Harmful content
• Political bias questions
• Adult or unsafe content
• Personal opinion based questions
• Copyright restricted text copies

-----------------------------------

FINAL INSTRUCTION:

Your output must integrate seamlessly into the existing QuizMaster system WITHOUT requiring any modification to existing features.

Return ONLY the JSON quiz object.
`;

    const userContent = `Generate ${count} ${difficulty} level quiz questions about: ${topic}`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userContent },
            ],
            model: 'llama-3.3-70b-versatile', // High performance model for complex tasks
            temperature: 0.5,
            response_format: { type: 'json_object' },
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No content received from AI');
        }

        return JSON.parse(content) as AIQuizResponse;
    } catch (error) {
        console.error('Groq API Error:', error);
        throw error;
    }
};
