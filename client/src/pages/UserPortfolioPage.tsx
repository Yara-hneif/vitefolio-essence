import { useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";

export default function UserPortfolioPage() {
  const { handle } = useParams();
  const { user, getHandle } = useAuth();

  const isOwner = user && getHandle() === handle;

  // In a next release, fetch user's real projects from your API.
  // For now, derive basic profile from auth metadata:
  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    (handle ? handle[0].toUpperCase() + handle.slice(1) : "User");

  const avatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="max-w-4xl mx-auto p-6 flex items-center gap-4">
          {avatar && <img src={avatar} alt="avatar" className="w-16 h-16 rounded-full object-cover" />}
          <div>
            <h1 className="text-3xl font-bold">{displayName}</h1>
            <p className="text-muted-foreground">@{handle}</p>
          </div>
          {isOwner && (
            <span className="ml-auto text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-900">
              You are the owner
            </span>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-10">
        <section>
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-muted-foreground">
            This is your personal portfolio page. In future releases, you will customize sections, colors, and layout.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Projects</h2>
          <ul className="grid md:grid-cols-2 gap-4">
            <li className="border rounded-xl p-4">
              <h3 className="font-semibold">Sample Project</h3>
              <p className="text-sm text-muted-foreground">Describe your awesome work here.</p>
            </li>
            <li className="border rounded-xl p-4">
              <h3 className="font-semibold">Another Project</h3>
              <p className="text-sm text-muted-foreground">Add links, screenshots and tags.</p>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
