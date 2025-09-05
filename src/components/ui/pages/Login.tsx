import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

const API_URL = "https://localhost:7044/Users"; // Ajustá al puerto real

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "info" | "success">("info");
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 🚀 función de login contra API
  async function apiLogin(email: string, password: string) {
    const res = await fetch(`${API_URL}/List`);
    if (!res.ok) throw new Error("Error al conectar con el servidor");
    const users = await res.json();

    const user = users.find((u: any) => u.email === email && u.user_password === password);

    if (!user) return { ok: false, message: "Credenciales inválidas" };

    // 👇 normalizar ID y asignar rol
    const userId = user.ID ?? user.id;
    user.role = userId === 2 ? "admin" : "user";

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
        setMessage(result.message);
      } else {
        localStorage.setItem("loggedUser", JSON.stringify(result.user));
        setMessageType("success");
        setMessage("Login exitoso");

        if (result.user.role === "admin") {
          navigate({ to: "/adminUsers" });
        } else {
          navigate({ to: "/HomePage" });
        }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <div className="flex flex-col items-center gap-4 mb-6">
          <img
            src="/logo-preview-placeholder.svg"
            alt="Logo"
            className="h-12 w-12"
          />
          <h1 className="text-center text-2xl font-bold tracking-tight text-gray-800">
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
          className={`mb-4 text-sm ${
            messageType === "error"
              ? "text-red-600"
              : messageType === "success"
              ? "text-emerald-600"
              : "text-gray-700"
          }`}
        >
          {message}
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-12 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 px-3 text-gray-600"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 py-2 text-white text-sm font-medium shadow hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Ingresando…" : "Sign in"}
          </button>

          <p className="text-center text-sm text-gray-600">
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
