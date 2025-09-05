import React from "react";
import { Home, User, Users, Settings } from "lucide-react";


// Tipado de ejemplo para las filas de la tabla
type UserRecord = {
  id: number;
  username: string;
  email: string;
};

// Datos de ejemplo (puedes sustituir por datos reales)
const SAMPLE_USERS: UserRecord[] = [
  { id: 1, username: "john_doe", email: "john_example@gmail.com" },
  { id: 2, username: "jane_smi", email: "john_example@gmail.com" },
  { id: 3, username: "mike_john", email: "john_example@gmail.com" },
  { id: 4, username: "alice_bro", email: "john_example@gmail.com" },
  { id: 5, username: "sara_39", email: "john_example@gmail.com" },
  { id: 6, username: "lorem", email: "john_example@gmail.com" },
  { id: 7, username: "ipsum", email: "john_example@gmail.com" },
  { id: 8, username: "Frank38", email: "john_example@gmail.com" },
  { id: 9, username: "sixseven", email: "john_example@gmail.com" },
];

export default function adminUsers() {


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top padding to mimic the margin in the mockup */}
      <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        <div className="rounded-2xl bg-white shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
            {/* Sidebar */}
            <aside className="border-b md:border-b-0 md:border-r border-gray-200 p-5 md:p-6 bg-gray-50/60 rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl">
              <nav className="space-y-2">
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-100 transition"
                >
                  <Home className="h-5 w-5" />
                  <span className="font-medium">Dashboard</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-100 transition"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Profile</span>
                </a>
                <a
                  href="#"
                  aria-current="page"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200"
                >
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Users</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-100 transition"
                >
                  <Settings className="h-5 w-5" />
                  <span className="font-medium">Settings</span>
                </a>
              </nav>
            </aside>

            {/* Main content */}
            <section className="p-6 md:p-8">
              <h1 className="text-2xl font-semibold text-gray-900">Manage Users</h1>

              {/* Table card */}
              <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-700">
                        <th className="w-16 px-4 py-3 font-semibold">ID</th>
                        <th className="px-4 py-3 font-semibold">Username</th>
                        <th className="px-4 py-3 font-semibold">Email</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white rounded-xl overflow-hidden">
                      {SAMPLE_USERS.map((u, idx) => (
                        <tr
                          key={u.id}
                          className={
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-4 py-3 text-gray-900">{u.id}</td>
                          <td className="px-4 py-3 text-gray-900">{u.username}</td>
                          <td className="px-4 py-3 text-gray-900">{u.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
