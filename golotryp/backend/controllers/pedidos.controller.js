const db = require("../db/database")

const crearPedido = (req, res) => {
  const {
    carrito,
    total,
    formaPago,
    clienteId,
    direccionEntrega,
    telefonoContacto,
  } = req.body

  const pedidoQuery = `
    INSERT INTO pedidos 
    (cliente_id, total, direccion_entrega, telefono_contacto)
    VALUES (?, ?, ?, ?)
  `

  db.query(
    pedidoQuery,
    [clienteId || null, total, direccionEntrega || null, telefonoContacto || null],
    (err, pedidoResult) => {
      if (err) return res.status(500).json(err)

      const pedidoId = pedidoResult.insertId

      const detalles = carrito.map((item) => [
        pedidoId,
        item.productId,
        item.presentationId,
        item.quantity,
        item.price,
        item.price * item.quantity,
      ])

      const detalleQuery = `
        INSERT INTO detalle_pedido
        (pedido_id, producto_id, presentacion_id, cantidad, precio_unitario, subtotal)
        VALUES ?
      `

      db.query(detalleQuery, [detalles], (err) => {
        if (err) return res.status(500).json(err)

        const estadoPago = formaPago === "efectivo" ? "pendiente" : "pagado"

        const pagoQuery = `
          INSERT INTO pagos
          (pedido_id, forma_pago, estado_pago, monto)
          VALUES (?, ?, ?, ?)
        `

        db.query(pagoQuery, [pedidoId, formaPago, estadoPago, total], (err) => {
          if (err) return res.status(500).json(err)

          res.json({
            mensaje: "Pedido creado correctamente",
            pedidoId,
          })
        })
      })
    }
  )
}

module.exports = {
  crearPedido,
}