const db = require("../db/database")

const obtenerProductos = (callback) => {
  const query = `
    SELECT 
      p.id,
      p.nombre,
      p.descripcion,
      p.stock,
      p.imagen,
      p.activo,
      c.nombre AS categoria,
      m.nombre AS marca,
      pp.id AS presentacion_id,
      pp.tipo_presentacion,
      pp.cantidad_unidades,
      pp.precio
    FROM productos p
    JOIN categorias c ON p.categoria_id = c.id
    JOIN marcas m ON p.marca_id = m.id
    LEFT JOIN presentaciones_producto pp ON pp.producto_id = p.id
    WHERE p.activo = 1
  `

  db.query(query, (err, results) => {
    if (err) return callback(err, null)

    const productsMap = {}

    results.forEach((row) => {
      if (!productsMap[row.id]) {
        productsMap[row.id] = {
          id: row.id,
          name: row.nombre,
          description: row.descripcion,
          stock: row.stock,
          image: row.imagen,
          category: row.categoria,
          brand: row.marca,
          presentations: [],
        }
      }

      if (row.presentacion_id) {
        productsMap[row.id].presentations.push({
          id: row.presentacion_id,
          type: row.tipo_presentacion,
          quantity: row.cantidad_unidades,
          price: row.precio,
        })
      }
    })

    callback(null, Object.values(productsMap))
  })
}

module.exports = {
  obtenerProductos,
}