import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

const API_URL = "https://localhost:7044/Users"; // Ajustá al puerto real de tu backend

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRememberChecked] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "info" | "success">(
    "info"
  );
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 🚀 función para login directo al backend
  async function apiLogin(
    email: string,
    password: string
  ): Promise<{ ok: boolean; message: string; user?: any }> {
    const res = await fetch(`${API_URL}/List`);
    if (!res.ok) throw new Error("Error al conectar con el servidor");
    const users = await res.json();

    const user = users.find(
      (u: any) => u.email === email && u.user_password === password
    );

    if (!user) {
      return { ok: false, message: "Credenciales inválidas" };
    }

    return { ok: true, message: "Login exitoso", user };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const result = await apiLogin(email, password);
      if (!result.ok) {
        setMessageType("error");
        setMessage(result.message ?? "Error de autenticación");
      } else {
        setMessageType("success");
        setMessage("Login exitoso");
  // Redirigir al dashboard o home
  navigate({ to: "/HomePage" });
      }
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-4">
        <div className="flex flex-col items-center gap-4 mb-6">
          <img src="/logo-preview-placeholder.svg" alt="Logo" className="h-12 w-12" />
          <h1 className="text-center text-2xl font-semibold tracking-tight">
            Sign in to your account
          </h1>
        </div>

        {/* Mensajes */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          tabIndex={-1}
          ref={liveRegionRef}
          className={`mb-3 text-sm ${
            messageType === "error"
              ? "text-red-600"
              : messageType === "success"
              ? "text-emerald-600"
              : "text-gray-700"
          }`}
        >
          {message}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-12 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-0 px-3 text-gray-600"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRememberChecked(e.target.checked)}
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 py-2 text-white text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Ingresando…" : "Sign in"}
          </button>

          <p className="text-center text-sm text-gray-700">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate({ to: "/Register" })}
              className="font-medium text-indigo-700 hover:underline"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
