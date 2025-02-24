import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
const [name, setName] = useState(""); // Add name state
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    if (isSignup) {
if (!name.trim()) {
        alert("Name is required!");
        return;
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (existingUser) {
        alert("Username already exists!");
        return;
      }

      // Create new user
      const newUser = {
        id: uuidv4(),
        name: name.trim(),
        username: username,
        password: password, // ⚠️ Hash passwords in production
      };

      const { error: insertError } = await supabase
        .from("users")
        .insert([newUser]);

      if (insertError) {
        console.error("Error creating user:", insertError);
        alert("Failed to create user.");
        return;
      }

      alert("Signup successful! Please login.");
      setIsSignup(false);
      setPassword("");
setName("");
      return;
    }

    // Handle Login
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (!user) {
      alert("Invalid credentials!");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    router.push("/");
  };

  return (
    <div className="w-full max-w-sm p-16  border  rounded-lg shadow-sm sm:p-7 mt-[17%] ml-[36%] bg-gray-800 border-gray-700 xs:ml-0 xs:mr-[4%]">
      <h1 className="text-2xl text-gray-50 text-center font-bold mb-4">
        {isSignup ? "Sign Up" : "Login"}
      </h1>
{isSignup && (
        <input
          type="text"
          placeholder="Full Name"
          className="w-[290px] block p-2 m-4 font-medium bg-gray-800  text-white border rounded border-gray-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      <input
        type="text"
        placeholder="Username"
        className="w-[290px] block p-2 m-4 font-medium bg-gray-800  text-white border rounded border-gray-500"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-[290px] block p-2 m-4 font-medium bg-gray-800  text-white border rounded border-gray-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleAuth}
        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {isSignup ? "Sign Up" : "Login"}
      </button>
      <button
        onClick={() => {
setIsSignup(!isSignup);
          setName("");
          setPassword("");
          setUsername("");
        }}
        className="mt-2  ml-8 text-blue-500 hover:text-blue-700"
      >
        {isSignup
          ? "Already have an account? Login"
          : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
};

export default Login;
