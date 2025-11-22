import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash' });

interface SessionContext {
  question: string;
  userRole: string;
  answers: string[]; // array of answer texts or summaries
}

export const generateGeminiResponse = async (prompt: string): Promise<string> => {
  const startTime = Date.now();
  try {
    console.log(`[Gemini] Starting API call at ${new Date().toISOString()}`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const duration = Date.now() - startTime;
    console.log(`[Gemini] API call successful in ${duration}ms`);
    if (!text) {
      throw new Error('Empty response from Gemini');
    }
    return text;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Gemini] API call failed after ${duration}ms:`, error);
    throw new Error('Failed to generate response from Gemini');
  }
};

export const generateSocraticResponse = async (query: string, context: SessionContext): Promise<string> => {
  const prompt = `You are a Socratic tutor in a collaborative problem-solving session. 
Question: ${context.question}
User role: ${context.userRole}
Answers so far: ${context.answers.join('; ')}
User query: ${query}
Provide guiding questions to help them reflect, without giving direct answers.`;

  console.log(`[Gemini] Generating Socratic response for query (length: ${query.length}) in session with question: ${context.question.substring(0, 50)}...`);
  const response = await generateGeminiResponse(prompt);
  console.log(`[Gemini] Socratic response generated (length: ${response.length})`);
  return response;
};