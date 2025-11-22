import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash' });

export const generateGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate response from Gemini');
  }
};

// Stub for future context-aware prompts
export const generateSocraticResponse = async (query: string, context: any): Promise<string> => {
  const prompt = `You are a Socratic tutor in a collaborative problem-solving session. The session context is: ${JSON.stringify(context)}. The user asks: "${query}". Provide guiding questions to help them reflect, without giving direct answers.`;
  return generateGeminiResponse(prompt);
};