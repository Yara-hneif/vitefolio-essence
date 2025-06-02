export default function Projects() {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-tr from-[#edf2fb] via-[#d7e3fc] to-[#c1d3fe] flex items-center justify-center px-4 text-slate-800">
      <div className="max-w-screen-md w-full text-center py-16">
        <h1 className="text-4xl font-bold mb-6 text-indigo-700">📁 Projects</h1>
        <p className="text-lg mb-8">
          Here you can explore some of the projects I've built using various web technologies.
        </p>
        <ul className="space-y-4">
          <li className="p-4 bg-white rounded shadow hover:shadow-md transition">🔧 PlannerX – A task management app</li>
          <li className="p-4 bg-white rounded shadow hover:shadow-md transition">🎮 Pokédex App – Pokémon data viewer</li>
          <li className="p-4 bg-white rounded shadow hover:shadow-md transition">👥 Meet The Team – GitHub code-share showcase</li>
        </ul>
      </div>
    </div>
  );
}
