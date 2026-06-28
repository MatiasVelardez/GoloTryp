import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Navbar({ totalItems, openCart, search, setSearch, products, addToCart }) {
  const { user, logout } = useAuth()

  const searchResults = search.trim()
    ? products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    : []

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 p-4">
        <Link to="/" className="text-4xl font-bold text-blue-900">
          Golotryp
        </Link>

        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-900"
          />

          {search.trim() && (
            <div className="absolute left-0 top-12 z-50 w-full rounded-lg border bg-white shadow-lg">
              {searchResults.length === 0 ? (
                <p className="p-4 text-sm text-gray-500">
                  No se encontraron productos.
                </p>
              ) : (
                <>
                  <div className="max-h-80 overflow-y-auto">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 border-b p-3"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 object-contain"
                        />

                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">
                            {product.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            Stock: {product.stock}
                          </p>
                        </div>

                        {product.presentations?.[0] && (
                          <button
                            onClick={() =>
                              addToCart(product, product.presentations[0])
                            }
                            className="rounded-lg bg-blue-900 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-800"
                          >
                            Agregar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setSearch("")}
                    className="w-full p-3 text-center text-xs font-semibold text-blue-900 hover:bg-gray-50"
                  >
                    Limpiar búsqueda
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm font-semibold text-gray-700 md:block">
                Hola, {user.nombre}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg border border-blue-900 px-3 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-50"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-lg border border-blue-900 px-3 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-50"
            >
              Iniciar sesión
            </Link>
          )}

          <button
            onClick={openCart}
            className="relative rounded-lg bg-blue-900 px-4 py-2 text-white transition hover:bg-blue-800"
          >
            🛒

            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 text-xs text-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar