import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ResponseProps {
  readonly messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  readonly maxTokens: number;
}

const generateResponse = async ({ messages, maxTokens }: ResponseProps) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 1,
      max_tokens: maxTokens,
    });

    return completion.choices[0].message;
  } catch (err) {
    console.error("ERROR:", err);
    return {
      role: "assistant",
      content: "I apologize, but I encountered an error while processing your request."
    };
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { messages, maxTokens } = req.body;
  const response = await generateResponse({ messages, maxTokens });
  res.status(200).json({ response });
}
