import { useNavigate } from "react-router-dom";
import IdeaDetails from "../components/IdeaDetails";

export default function IdeaDetailsPage() {
  const navigate = useNavigate();
  const idea = JSON.parse(localStorage.getItem("selectedIdea") || "{}");

  const handleEvaluate = () => {
    navigate("/evaluation");
  };

  if (!idea || !idea.title) {
    return <p className="text-center mt-20">No idea selected.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <IdeaDetails idea={idea} onEvaluate={handleEvaluate} />
    </div>
  );
}
