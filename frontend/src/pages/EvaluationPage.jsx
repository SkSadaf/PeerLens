import { useEffect, useState } from "react";
import EvaluationResult from "../components/EvaluationResult";

export default function EvaluationPage() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const evaluate = async () => {
      const idea = JSON.parse(localStorage.getItem("selectedIdea") || "{}");
      const papersText = JSON.parse(localStorage.getItem("papersText") || "[]");

      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, papersText }),
      });
      const data = await res.json();
      setResult(data);
    };
    evaluate();
  }, []);

  if (!result) {
    return <p className="text-center mt-20">Evaluating, please wait...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <EvaluationResult result={result} />
    </div>
  );
}
