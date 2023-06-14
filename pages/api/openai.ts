
import type { NextApiRequest, NextApiResponse } from 'next';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration);

interface ResponseProps {
  readonly messages: ChatCompletionRequestMessage[]
  readonly maxTokens: number
}

const generateResponse = async ({ messages, maxTokens }: ResponseProps) => {
  try {
    console.log("messages in api", messages)
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 1,
      max_tokens: maxTokens,
    })

    if (completion.status !== 200) {
      console.log
        return `Request failed with status ${completion.status}`;
      }
    // console.log("Completion", completion?.data?.choices[0].message)
    return completion?.data?.choices[0].message
  } catch (err) {
    console.log("ERROR:", err)
    return err
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { messages, maxTokens } = req.body

  const response = await generateResponse({messages, maxTokens})

  res.status(200).json({response})
}
