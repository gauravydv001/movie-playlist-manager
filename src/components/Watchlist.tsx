import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient"; // ✅ Import from the new file
import { Button } from "@/components/ui/button";
import { Movie } from '../types';


interface WatchlistProps {
  watchlistMovies: Movie[]; // Renamed from movies to avoid duplicate identifier
}

const Watchlist: React.FC<WatchlistProps> = ({ watchlistMovies }) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      const { data, error } = await supabase.from("watchlist").select("*");
      if (!error && data) {
        setMovies(data);
      }
    };
    fetchWatchlist();
  }, []);

  const toggleWatched = async (id: number, watched: boolean) => {
    const { error } = await supabase
      .from("watchlist")
      .update({ watched: !watched })
      .eq("id", id);
    if (!error) {
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === id ? { ...movie, watched: !watched } : movie
        )
      );
    }
  };

  const removeMovie = async (id: number) => {
    const { error } = await supabase.from("watchlist").delete().eq("id", id);
    if (!error) {
      setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
    }
  };

  const renderStreamingProviders = (movie: Movie) => {
    if (!movie.streaming?.US?.flatrate) return null;
    
    return movie.streaming.US.flatrate.map((provider) => (
      <span key={provider.provider_id}>{provider.provider_name}</span>
    ));
  };

  return (
    <div className=" flex flex-wrap ml-2">
    {watchlistMovies.map((movie) => (
        <div
            key={movie.id}
            className=" m-2 p-4 w-64 border rounded-lg shadow-sm bg-gray-800 border-gray-700"
        >
            <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={200}
                height={300}
                className="rounded-lg w-full h-auto object-cover"
            />
            <div className="">
                <h3 className="text-white text-lg font-semibold">{movie.title}</h3>
                <p className="text-gray-300 text-sm truncate">{movie.overview}</p>
                {movie.streaming?.US?.flatrate && (
        <div className="mt-2">
          <p className="text-yellow-400">Available on:</p>
          <div className="flex space-x-2">
            {movie.streaming.US.flatrate.map((provider) => (
              <Image
                key={provider.provider_id}
                src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`}
                alt={provider.provider_name}
                width={40}
                height={40}
                className="rounded"
              />
            ))}
          </div>
        </div>
      )}
                <div className="flex gap-3 mt-3">
                    <Button
                        onClick={() => toggleWatched(movie.id, movie.watched)}
                        size="sm"
                        variant={movie.watched ? "outline" : "secondary"}
                    >
                        {movie.watched ? "Unwatch" : "Watched"}
                    </Button>
                    <Button
                        onClick={() => removeMovie(movie.id)}
                        size="sm"
                        variant="destructive"
                    >
                        Remove
                    </Button>
                </div>
            </div>
        </div>
    ))}
</div>

  );
}

export default Watchlist;
