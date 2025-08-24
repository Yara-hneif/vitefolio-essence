import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_SECRET } from "@/lib/config";

const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (token === ADMIN_SECRET) {
      setAuthorized(true);
    } else {
      const userInput = prompt("🔒 Enter admin password to access this page:");
      if (userInput === ADMIN_SECRET) {
        localStorage.setItem("admin_token", userInput);
        setAuthorized(true);
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  if (!authorized) return null;

  return <>{children}</>;
};

export default ProtectedAdmin;
