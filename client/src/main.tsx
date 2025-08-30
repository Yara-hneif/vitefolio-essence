// client/src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

import { AuthProvider as AppAuthProvider } from "@/features/auth/AuthProvider";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!;
if (!clerkPubKey) {
  console.error("Missing VITE_CLERK_PUBLISHABLE_KEY. Add it to client/.env or .env.local");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <AppAuthProvider>
          <App />
        </AppAuthProvider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
