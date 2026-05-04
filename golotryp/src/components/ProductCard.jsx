function ProductCard({ product, addToCart }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
      <img
        src={product.image}
        alt={product.name}
        className="mb-3 h-32 w-full object-contain"
      />

      <h3 className="text-sm font-bold text-gray-800">
        {product.name}
      </h3>

      <p className="mb-2 text-xs text-gray-500">
        Stock: {product.stock}
      </p>

      <div className="space-y-2">
        {product.presentations && product.presentations.length > 0 ? (
          product.presentations.map((presentation) => (
            <div key={presentation.id} className="rounded-lg border p-2">
              <p className="text-xs font-semibold text-gray-700">
                {presentation.type === "unidad" && "Unidad"}
                {presentation.type === "display" &&
                  `Display x${presentation.quantity}`}
                {presentation.type === "bulto" &&
                  `Bulto x${presentation.quantity}`}
              </p>

              <p className="text-sm font-bold text-blue-900">
                ${presentation.price}
              </p>

              <button
                onClick={() => addToCart(product, presentation)}
                className="mt-2 w-full rounded-lg bg-blue-900 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-800"
              >
                Agregar
              </button>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400">
            Sin presentaciones
          </p>
        )}
      </div>
    </div>
  )
}

export default ProductCard