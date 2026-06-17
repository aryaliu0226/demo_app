/** @format */

import OpenAI from 'openai'
const client = new OpenAI()

export const openAi = await client.responses.create({
  model: 'gpt-5.5',
  input: 'Write a short bedtime story about a unicorn.',
})

console.log(openAi)
