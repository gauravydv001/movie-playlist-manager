import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";
import SearchBar from "@/components/SearchBar";
import Watchlist from '../components/Watchlist';
import { User, Movie } from '../types';

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || 'null');
    if (!storedUser) {
      router.push("/login");
      return;
    }

    setUser(storedUser);
    fetchWatchlist(storedUser.id);
  }, []);

  const fetchWatchlist = async (userId: string) => {
    if (!userId) return;
  
    const { data, error } = await supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", userId); // ✅ Fetch only movies for logged-in user
  
    if (error) {
      console.error("Error fetching watchlist:", error);
    } else {
      setWatchlist(data);
    }
  };

  const handleUserSelect = async (userId: string) => {
    // Your existing code
  };

  const fetchMovies = async () => {
    const response = await fetch('/api/movies');
    const data: Movie[] = await response.json();
    setMovies(data);
  };

  return (
    <div className="p-6 bg-gray-900 ">
      {user ? (
        <>
        <header className=" shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">Hello, {user.username}! 🎬</h1>

          <SearchBar user={user} refreshWatchlist={() => fetchWatchlist(user.id)} />
        </div>
          </header>

          <h2 className="text-xl font-semibold mt-6">Your Watchlist</h2>
          <Watchlist watchlistMovies={movies} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Home;
