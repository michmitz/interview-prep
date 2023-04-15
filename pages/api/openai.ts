
import type { NextApiRequest, NextApiResponse } from 'next';
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration);

interface ResponseProps {
  readonly role: ChatCompletionRequestMessageRoleEnum
  readonly content: string
  readonly maxTokens: number
}

const generateResponse = async ({ role, content, maxTokens }: ResponseProps) => {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role, content }],
      temperature: 1,
      max_tokens: maxTokens,
    })
    console.log("Completion", completion)
    return completion?.data?.choices[0].message
  } catch (err) {
    console.log("ERROR:", err)
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { role, content, maxTokens } = req.body

  const response = await generateResponse({role, content, maxTokens})

  res.status(200).json({response})
}
