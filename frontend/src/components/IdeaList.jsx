export default function IdeaList({ ideas, onSelect }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Select a Research Idea</h2>
      {ideas.map((idea, index) => (
        <div
          key={index}
          className="p-4 border rounded-lg shadow hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelect(idea)}
        >
          <h3 className="font-bold">{index + 1}. {idea.title}</h3>
          <p className="text-gray-600">
            {idea.description.length > 150
              ? idea.description.slice(0, 150) + "..."
              : idea.description}
          </p>
        </div>
      ))}
    </div>
  );
}
