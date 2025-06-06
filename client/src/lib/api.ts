const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/*
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!BASE_URL) throw new Error("VITE_API_BASE_URL is not defined");
*/

// Fetch projects from the API
export async function fetchProjects() {
  const res = await fetch(`${BASE_URL}/api/projects`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

// Fetch project details by slug
export async function sendContact(data: {
  name: string;
  email: string;
  message: string;
}) {
  const res = await fetch(`${BASE_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}
