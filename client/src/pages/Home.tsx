export default function Home() {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-tr from-[#edf2fb] via-[#d7e3fc] to-[#c1d3fe] flex items-center justify-center px-4 text-slate-800">
      <div className="text-center max-w-2xl w-full space-y-8">
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight">
          <span role="img" aria-label="home" className="mr-2">🏠</span>
          Welcome Home
        </h1>

        <p className="text-xl sm:text-2xl text-gray-600">
          Discover elegant web solutions, designed for clarity, performance, and aesthetic harmony.
        </p>
        <button className="mt-6 px-8 py-3 bg-indigo-600 text-white text-lg rounded-lg shadow-md hover:bg-indigo-700 hover:scale-105 transition-all duration-300">
          ✨ Explore Projects
        </button>
      </div>
    </div>
  );
}
