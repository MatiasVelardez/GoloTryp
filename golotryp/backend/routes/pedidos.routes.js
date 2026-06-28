const express = require("express")
const {
  registrarPedido,
} = require("../controllers/pedidos.controller")

const router = express.Router()

router.post("/", registrarPedido)

module.exports = router