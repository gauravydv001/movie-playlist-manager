import { Movie } from '../types';

export const fetchMovie = async (movieId: string): Promise<Movie> => {
  const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  // Fetch basic movie details
  const movieResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`
  );
  const movieData = await movieResponse.json();

  // Fetch streaming availability
  const streamingResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`
  );
  const streamingData = await streamingResponse.json();

  return {
    ...movieData,
    streaming: streamingData.results || {}, // ✅ Include streaming providers
  };
};
