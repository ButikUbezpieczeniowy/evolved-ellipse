import 'dotenv/config';  // load .env variables
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "user", content: "Hello!"}
    ],
    max_tokens: 10,
  });
  console.log(response.choices[0].message.content);
}

test();
