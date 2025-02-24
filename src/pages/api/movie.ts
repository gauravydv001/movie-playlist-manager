import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const API_KEY = process.env.TMDB_API_KEY;
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}`);
  const data = await response.json();

  if (response.ok) {
    res.status(200).json(data.results);
  } else {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
}
