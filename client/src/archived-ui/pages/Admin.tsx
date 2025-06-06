export default function Admin() {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#fff8e7] via-[#fdeff2] to-[#ffffff] flex items-center justify-center px-6 text-gray-800">
      <div className="text-center max-w-lg w-full py-20">
        <h1 className="text-4xl font-bold text-gray-700 mb-6">🔐 Admin Panel</h1>
        <p className="text-lg mb-4">This area is restricted to authorized users only.</p>
        <button className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition">
          Login
        </button>
      </div>
    </div>
  );
}
