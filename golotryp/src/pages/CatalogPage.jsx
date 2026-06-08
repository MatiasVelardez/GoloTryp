import { useEffect, useState } from "react"
import ProductCard from "../components/ProductCard"
import Navbar from "../components/Navbar"

function CatalogPage() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState(() => {
  const savedCart = localStorage.getItem("golotryp_cart")

    if (savedCart) {
      return JSON.parse(savedCart)
    }

    return []
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [selectedBrand, setSelectedBrand] = useState("Todas")

  useEffect(() => {
    fetch("http://localhost:3000/productos")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.log("Error al traer productos:", error))
  }, [])

  useEffect(() => {
    localStorage.setItem(
      "golotryp_cart",
      JSON.stringify(cart)
    )
  }, [cart])

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  const categories = [
    "Todas",
    ...new Set(products.map((product) => product.category)),
  ]

  const productsByCategory =
    selectedCategory === "Todas"
      ? products
      : products.filter((product) => product.category === selectedCategory)

  const brands = [
    "Todas",
    ...new Set(productsByCategory.map((product) => product.brand)),
  ]

  const filteredProducts =
    selectedBrand === "Todas"
      ? productsByCategory
      : productsByCategory.filter((product) => product.brand === selectedBrand)

  const addToCart = (product, presentation) => {
    const cartItemId = `${product.id}-${presentation.id}`

    const existingItem = cart.find(
      (item) => item.cartItemId === cartItemId
    )

    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )

      setCart(updatedCart)
    } else {
      const newItem = {
        cartItemId,
        productId: product.id,
        presentationId: presentation.id,
        name: product.name,
        image: product.image,
        presentationType: presentation.type,
        presentationQuantity: presentation.quantity,
        price: presentation.price,
        quantity: 1,
      }

      setCart([...cart, newItem])
    }
  }

  const increaseQuantity = (cartItemId) => {
    const updatedCart = cart.map((item) =>
      item.cartItemId === cartItemId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )

    setCart(updatedCart)
  }

  const decreaseQuantity = (cartItemId) => {
    const updatedCart = cart
      .map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0)

    setCart(updatedCart)
  }

  const removeFromCart = (cartItemId) => {
    const updatedCart = cart.filter(
      (item) => item.cartItemId !== cartItemId
    )

    setCart(updatedCart)
  }

  const finalizarCompra = () => {
  if (cart.length === 0) {
    alert("El carrito está vacío")
    return
  }

  const pedido = {
    carrito: cart,
    total: totalPrice,
    formaPago: "efectivo", // por ahora fijo, después hacemos selector
  }

  fetch("http://localhost:3000/pedidos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pedido),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(`Pedido creado correctamente. ID: ${data.pedidoId}`)
      setCart([])
      localStorage.removeItem("golotryp_cart")
      setIsCartOpen(false)
    })
    .catch((error) => {
      console.log("Error al crear pedido:", error)
      alert("Hubo un error al crear el pedido")
    })
}

  const handleSelectCategory = (category) => {
    setSelectedCategory(category)
    setSelectedBrand("Todas")
  }

  const getPresentationLabel = (item) => {
    if (item.presentationType === "unidad") return "Unidad"
    if (item.presentationType === "display") {
      return `Display x${item.presentationQuantity}`
    }
    if (item.presentationType === "bulto") {
      return `Bulto x${item.presentationQuantity}`
    }

    return item.presentationType
  }

  return (
    <>
      <Navbar
        totalItems={totalItems}
        openCart={() => setIsCartOpen(true)}
        search={search}
        setSearch={setSearch}
        products={products}
        addToCart={addToCart}
      />

      <div className="min-h-screen bg-gray-100 p-6">
        <section className="mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="mb-4 text-3xl font-bold text-blue-900">
              Catálogo
            </h1>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleSelectCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedCategory === category
                      ? "bg-blue-900 text-white"
                      : "bg-white text-blue-900 hover:bg-blue-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[220px_1fr]">
            <aside className="h-fit rounded-xl bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-blue-900">
                Marcas
              </h2>

              <div className="space-y-2">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                      selectedBrand === brand
                        ? "bg-blue-900 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </aside>

            <main>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {filteredProducts.length} productos encontrados
                </p>

                <p className="text-sm font-semibold text-blue-900">
                  Categoría: {selectedCategory}
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <p className="rounded-lg bg-white p-4 text-gray-500">
                  No hay productos para esta selección.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      addToCart={addToCart}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>
        </section>
      </div>

      <div
        className={`fixed inset-0 z-50 flex transition-opacity duration-300 ease-in-out ${
          isCartOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="flex-1 bg-black/40"
          onClick={() => setIsCartOpen(false)}
        />

        <aside
          className={`flex h-full w-80 transform flex-col bg-white p-4 shadow-lg transition-transform duration-300 ease-in-out ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="mb-4 flex items-center justify-between border-b pb-3">
            <h2 className="text-xl font-bold text-blue-900">
              Carrito
            </h2>

            <button
              onClick={() => setIsCartOpen(false)}
              className="text-sm font-semibold text-gray-500 hover:text-gray-800"
            >
              Cerrar
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="text-sm text-gray-500">El carrito está vacío</p>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="mb-4 flex gap-3 border-b pb-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg object-contain"
                    />

                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {item.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {getPresentationLabel(item)}
                      </p>

                      <p className="text-sm text-gray-500">
                        Precio: ${item.price}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => decreaseQuantity(item.cartItemId)}
                          className="rounded bg-gray-200 px-2 py-1 font-bold"
                        >
                          -
                        </button>

                        <span className="text-sm font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.cartItemId)}
                          className="rounded bg-blue-900 px-2 py-1 font-bold text-white"
                        >
                          +
                        </button>

                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="ml-auto text-xs font-semibold text-red-600"
                        >
                          Eliminar
                        </button>
                      </div>

                      <p className="mt-2 text-right font-bold text-blue-900">
                        Subtotal: ${item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold text-blue-900">
                  <p>Total:</p>
                  <p>${totalPrice}</p>
                </div>

                <button onClick={finalizarCompra}className="mt-4 w-full rounded-lg bg-blue-900 py-2 font-semibold text-white transition hover:bg-blue-800">
                  Finalizar compra
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  )
}

export default CatalogPage