import { useMemo, useState } from "react";
import Header from "../Header";
import IncidentCard from "../IncidentCard";
import { mockIncidents } from "../data/mockIncidents";
import Pagination from "../Pagination";

// Tipamos los incidentes directamente desde el mock 
type Incident = typeof mockIncidents[number];

type CartItem = {
  id: string;
  title: string;
  price: number;   // 100 o 200 según verified
  quantity: number;
};

export default function HomePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  // estado de paginación
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const getPrice = (incident: Incident) => (incident.verified ? 200 : 100);

  const addToCart = (incident: Incident) => {
    const price = getPrice(incident);
    setCart((prev) => {
      if (prev.some((i) => i.id === incident.id)) {
        return prev;
      }
      return [...prev, { id: incident.id, title: incident.title, price, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const filteredIncidents = useMemo(() => {
    const s = search.trim().toLowerCase();
    return mockIncidents.filter((incident) => {
      const matchesFilter = filter === "all" || incident.type.toLowerCase() === filter;
      const matchesSearch = s === "" || incident.location.toLowerCase().includes(s);
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  // aplicar el slice para paginar
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedIncidents = filteredIncidents.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} cartItems={cart} total={total} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-31">
        {/* Título y descripción */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Available Incident Reports
          </h2>
          <p className="text-gray-600">
            Browse and select incident reports to purchase for your contracting needs.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* Búsqueda por ubicación */}
            <div className="w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search by location..."
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Filtro por tipo */}
            <div className="w-full md:w-1/2">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All Incident Types</option>
                <option value="robbery">Robbery</option>
                <option value="fire">Fire</option>
                <option value="crime">Crime</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid con paginación */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedIncidents.map((incident) => {
            const price = getPrice(incident);
            const isChecked = cart.some((i) => i.id === incident.id);
            return (
              <IncidentCard
                key={incident.id}
                id={incident.id}
                type={incident.type}
                title={incident.title}
                location={incident.location}
                date={incident.date}
                price={price}
                verified={incident.verified}
                checked={isChecked}
                onAddToCart={() => addToCart(incident)}
                onRemoveFromCart={() => removeFromCart(incident.id)}
              />
            );
          })}
        </div>

        {/* Paginación */}
        <Pagination
          currentPage={page}
          totalItems={filteredIncidents.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
        />

        {/* Barra inferior fija (total + checkout) */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 md:bg-transparent border-t md:border-0 z-10 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.293 2.293A1 1 0 007 17h10a1 1 0 00.894-1.447L17 13M7 13V6h10v7"
                  />
                </svg>
                <span className="text-gray-700 font-medium">
                  {cart.length} incidents selected
                </span>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-lg font-semibold text-gray-900">
                  Total: ${total.toFixed(2)}
                </span>
                <button
                  type="button"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={cart.length === 0}
                  onClick={() =>
                    alert(`Proceeding to checkout: $${total.toFixed(2)}`)
                  }
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
