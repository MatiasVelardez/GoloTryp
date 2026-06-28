const {
  crearPedido,
} = require("../models/pedidos.model")

const registrarPedido = (req, res) => {
  crearPedido(req.body, (err, resultado) => {
    if (err) return res.status(500).json(err)

    res.json(resultado)
  })
}

module.exports = {
  registrarPedido,
}