export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md p-4 text-xl font-bold">
        Research Idea Assistant
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
