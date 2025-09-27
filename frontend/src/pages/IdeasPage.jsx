import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IdeaList from "../components/IdeaList";

export default function IdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIdeas = async () => {
      const papersText = JSON.parse(localStorage.getItem("papersText") || "[]");
      const res = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ papersText }),
      });
      const data = await res.json();
      setIdeas(data.ideas || []);
    };
    fetchIdeas();
  }, []);

  const handleSelect = (idea) => {
    localStorage.setItem("selectedIdea", JSON.stringify(idea));
    navigate("/idea-details");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <IdeaList ideas={ideas} onSelect={handleSelect} />
    </div>
  );
}
