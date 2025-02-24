import { useEffect, useState } from "react";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const response = await fetch("/api/recommendations");
      const data = await response.json();
      setRecommendations(data);
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">AI-Powered Recommendations</h2>
      <ul>
        {recommendations.map((movie, index) => (
          <li key={index} className="mb-2">{movie}</li>
        ))}
      </ul>
    </div>
  );
}
