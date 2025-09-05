import React, { useEffect, useState } from "react";
import { Home, User, Users, Settings } from "lucide-react";

// Tipado según lo que querés mostrar
type UserRecord = {
  id: number;
  username: string;
  email: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // URL de la API
  const API_URL = "https://localhost:7044/Users/List"; // ⚠️ Ajusta el puerto al de tu backend

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        
        const mapped: UserRecord[] = data.map((u: any) => ({
          id: u.id,
          username: u.username,
          email: u.email,
        }));

        setUsers(mapped);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        <div className="rounded-2xl bg-white shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
            
            {/* Sidebar */}
            <aside className="border-b md:border-b-0 md:border-r border-gray-200 p-5 md:p-6 bg-gray-50/60 rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl">
              <nav className="space-y-2">
                <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-100 transition">
                  <Home className="h-5 w-5" />
                  <span className="font-medium">Dashboard</span>
                </a>
                <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-100 transition">
                  <User className="h-5 w-5" />
                  <span className="font-medium">Profile</span>
                </a>
                <a href="#" aria-current="page" className="flex items-center gap-3 rounded-xl px-3 py-2 bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Users</span>
                </a>
                <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-100 transition">
                  <Settings className="h-5 w-5" />
                  <span className="font-medium">Settings</span>
                </a>
              </nav>
            </aside>

            {/* Main content */}
            <section className="p-6 md:p-8">
              <h1 className="text-2xl font-semibold text-gray-900">Manage Users</h1>

              <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
                <div className="overflow-x-auto">
                  {loading ? (
                    <p className="text-gray-500 text-center">Loading users...</p>
                  ) : (
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="text-gray-700">
                          <th className="w-16 px-4 py-3 font-semibold">ID</th>
                          <th className="px-4 py-3 font-semibold">Username</th>
                          <th className="px-4 py-3 font-semibold">Email</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white rounded-xl overflow-hidden">
                        {users.map((u, idx) => (
                          <tr key={u.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-3 text-gray-900">{u.id}</td>
                            <td className="px-4 py-3 text-gray-900">{u.username}</td>
                            <td className="px-4 py-3 text-gray-900">{u.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

