export default function EvaluationResult({ result }) {
  return (
    <div className="space-y-4 p-6 border rounded-lg shadow bg-white">
      <h2 className="text-2xl font-bold">Final Evaluation</h2>
      <p><span className="font-semibold">Score:</span> {result.score}</p>
      <p><span className="font-semibold">Analysis:</span></p>
      <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded-lg">
        {result.analysis}
      </pre>
    </div>
  );
}
