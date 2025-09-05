import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🚀 borrar datos de sesión
    localStorage.removeItem("loggedUser");

    // redirigir al login
    navigate({ to: "/" }); // 👈 ajusta si tu ruta de login es diferente
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg font-medium text-gray-700">Logging out...</p>
    </div>
  );
}
