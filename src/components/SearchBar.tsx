import { useState } from "react";
import Image from "next/image";
import supabase from "@/lib/supabaseClient"; // Import Supabase client
import { User, Movie } from '../types';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

interface SearchBarProps {
  user: User;
  refreshWatchlist: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ user, refreshWatchlist }) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Movie[]>([]); // Stores top 5 suggestions

  const handleSearch = async () => {
    if (!search.trim()) return;

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${search}&api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    
    if (data.results) {
      setSuggestions(data.results.slice(0, 5)); // Show only top 5 results
    }
  };

  const handleSelectMovie = async (movie: Movie) => {
    const storedUser = JSON.parse(localStorage.getItem("user") || 'null');
    if (!storedUser?.id) {
      alert("You need to log in to add movies to your watchlist.");
      return;
    }
  
    // Ensure user ID is UUID
    const { data: dbUser, error: userError } = await supabase
      .from("users")
      .select("id, username")
      .eq("id", storedUser.id)
      .single();
  
    if (userError || !dbUser) {
      alert("User not found in database.");
      console.error("User lookup error:", userError);
      return;
    }
  
    // Add movie to watchlist
    const { data, error } = await supabase.from("watchlist").insert([
      {
        user_id: dbUser.id, // Use verified UUID
        username: dbUser.username,
        title: movie.title,
        poster_path: movie.poster_path,
        watched: false,
      },
    ]);
  
    if (error) {
      console.error("Error adding movie:", error);
      alert("Failed to add movie. Check the console for more details.");
    } else {
      console.log("Movie added to watchlist:", data);
      refreshWatchlist();
    }
  };

  const handleAddMovie = async (movie: Movie) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No user ID found');
      return;
    }
    // ...rest of the code
  };
  
  

  return (
    <div className="relative z-100">
     
      <input
        type="text"
        placeholder="Search movies..."
        className="p-2  w-[350px] d font-medium bg-gray-800  text-white border rounded-full border-gray-500 "
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          handleSearch(); // Fetch suggestions while typing
        }}
        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
      />
      <button onClick={handleSearch} className=" ml-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300  p-3 rounded-full pt-3 -mr-[7.5rem]">
        Search
      </button>
     

      {/* Dropdown for top 5 suggestions with images and add button */}
      {suggestions.length > 0 && (
        <ul className="absolute bg-gray-900 text-white w-full mt-1 rounded shadow-lg max-h-72 overflow-auto">
          {suggestions.map((movie: Movie) => (
            <li
              key={movie.id}
              className="p-2 border-b border-gray-700 hover:bg-gray-800 cursor-pointer flex items-center gap-4"
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  width={50}
                  height={75}
                  className="rounded"
                />
              ) : (
                <div className="w-[50px] h-[75px] bg-gray-700 rounded flex items-center justify-center text-sm">
                  No Image
                </div>
              )}
              <span className="flex-grow">{movie.title}</span>
              <button
                onClick={() => handleSelectMovie(movie)}
                className="bg-green-500 px-3 py-1 rounded text-white"
              >
                Add to Watchlist
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
