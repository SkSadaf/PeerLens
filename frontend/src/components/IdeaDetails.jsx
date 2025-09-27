export default function IdeaDetails({ idea, onEvaluate }) {
  return (
    <div className="space-y-4 p-4 border rounded-lg shadow bg-white">
      <h2 className="text-2xl font-bold">{idea.title}</h2>
      <p><span className="font-semibold">Problem:</span> {idea.problem}</p>
      <p><span className="font-semibold">Methodology:</span> {idea.methodology}</p>
      <p><span className="font-semibold">Contribution:</span> {idea.contribution}</p>

      <button
        onClick={onEvaluate}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
      >
        Check Publishability Score
      </button>
    </div>
  );
}
