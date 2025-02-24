import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from 'openai';
// Install OpenAI package first: npm install openai

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userWatchlist = ["Inception", "Interstellar", "The Dark Knight"]; // Replace with actual user watchlist

  const prompt = `Based on the movies ${userWatchlist.join(
    ", "
  )}, recommend 5 similar movies.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  res.status(200).json(completion.choices[0].message?.content?.split("\n") ?? []);
}
