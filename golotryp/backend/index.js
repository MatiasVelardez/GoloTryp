const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "golotryp",
})

db.connect((err) => {
  if (err) {
    console.log("❌ Error de conexión:", err)
  } else {
    console.log("✅ Conectado a MySQL")
  }
})

app.get("/productos", (req, res) => {
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
    if (err) {
      return res.status(500).json(err)
    }

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
          price: row.precio,
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

    res.json(Object.values(productsMap))
  })
})

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000")
})