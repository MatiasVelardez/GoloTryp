const express = require("express")
const {
  registrarUsuario,
  iniciarSesion,
} = require("../controllers/usuarios.controller")

const router = express.Router()

router.post("/registro", registrarUsuario)
router.post("/login", iniciarSesion)

module.exports = router