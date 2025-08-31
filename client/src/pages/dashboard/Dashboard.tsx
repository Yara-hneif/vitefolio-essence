import { useProjects } from "@/hooks/useProjects";

export default function Dashboard() {
  const { projects, isLoading } = useProjects();

  if (isLoading) return <p>Loading...</p>;

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Projects</h1>
      <ul className="space-y-4">
        {projects?.map((p) => (
          <li key={p.id} className="p-4 rounded bg-white shadow">
            <h2 className="text-xl font-semibold">{p.title}</h2>
            <p>{p.description}</p>
            <span className="text-sm text-gray-500">
              Last updated:{" "}
              {new Date(p.updated_at || p.created_at || 0).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
