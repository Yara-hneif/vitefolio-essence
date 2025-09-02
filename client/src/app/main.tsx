import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "@/app/App";
import "@/utils/styles/globals.css";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!;
if (!clerkPubKey) {
  console.error("Missing VITE_CLERK_PUBLISHABLE_KEY. Add it to client/.env or .env.local");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
