const express = require("express")
const cors = require("cors")

const productosRoutes = require("./routes/productos.routes")
const pedidosRoutes = require("./routes/pedidos.routes")
const usuariosRoutes = require("./routes/usuarios.routes")

const app = express()

app.use(cors())
app.use(express.json())
app.use("/usuarios", usuariosRoutes)

app.use("/productos", productosRoutes)
app.use("/pedidos", pedidosRoutes)
app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000")
})