const express = require("express")
const {
  listarProductos,
} = require("../controllers/productos.controller")

const router = express.Router()

router.get("/", listarProductos)

module.exports = router