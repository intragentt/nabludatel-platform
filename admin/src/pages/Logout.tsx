// /admin/src/pages/Logout.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  }, [navigate]);

  return null;
}
