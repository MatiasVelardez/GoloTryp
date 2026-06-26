const {
  obtenerProductos,
} = require("../models/productos.model")

const listarProductos = (req, res) => {
  obtenerProductos((err, productos) => {
    if (err) return res.status(500).json(err)

    res.json(productos)
  })
}

module.exports = {
  listarProductos,
}