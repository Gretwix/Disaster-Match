import { useState } from "react";

const API_URL = "https://localhost:7044/Users"; // ajusta el puerto al de tu backend

export default function Register() {
  const [f_name, setFName] = useState("");
  const [l_name, setLName] = useState("");
  const [username, setUsername] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | "info">(
    "info"
  );

  // 👉 función que llama al backend
  async function apiRegister(user: any) {
    const res = await fetch(`${API_URL}/Save`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error("Error al registrar usuario");
    return await res.text(); // el backend devuelve string
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await apiRegister({
        f_name,
        l_name,
        username,
        email,
        user_password: password,
        phone: "",
        user_address: "",
        company,
        remember_token: "",
        fechaRegistro: new Date().toISOString(), // 👈 NECESARIO
      });
      setMessageType("success");
      setMessage(res);

      // limpiar inputs
      setFName("");
      setLName("");
      setUsername("");
      setCompany("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setMessageType("error");
      setMessage("No se pudo registrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm px-6 py-8 bg-white rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Crear Cuenta</h1>

        {message && (
          <div
            className={`mb-3 text-sm ${
              messageType === "error"
                ? "text-red-600"
                : messageType === "success"
                ? "text-green-600"
                : "text-gray-600"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="text"
            required
            placeholder="Nombre"
            value={f_name}
            onChange={(e) => setFName(e.target.value)}
            className="block w-full rounded border px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Apellido"
            value={l_name}
            onChange={(e) => setLName(e.target.value)}
            className="block w-full rounded border px-3 py-2 text-sm"
          />
          <input
            type="text"
            required
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full rounded border px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Empresa"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="block w-full rounded border px-3 py-2 text-sm"
          />
          <input
            type="email"
            required
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded border px-3 py-2 text-sm"
          />
          <input
            type="password"
            required
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Creando..." : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
}
