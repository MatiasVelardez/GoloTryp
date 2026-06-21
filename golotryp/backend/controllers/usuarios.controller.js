const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("../db/database")

const SECRET_KEY = "golotryp_secret_key"

const registrarUsuario = async (req, res) => {
  const { nombre, apellido, email, password, telefono, direccion } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const query = `
      INSERT INTO usuarios
      (nombre, apellido, email, password, telefono, direccion)
      VALUES (?, ?, ?, ?, ?, ?)
    `

    db.query(
      query,
      [nombre, apellido, email, hashedPassword, telefono, direccion],
      (err) => {
        if (err) return res.status(500).json(err)

        res.json({
          mensaje: "Usuario registrado correctamente",
        })
      }
    )
  } catch (error) {
    res.status(500).json(error)
  }
}

const iniciarSesion = (req, res) => {
  const { email, password } = req.body

  const query = `
    SELECT *
    FROM usuarios
    WHERE email = ? AND activo = 1
  `

  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json(err)

    if (results.length === 0) {
      return res.status(401).json({
        mensaje: "Usuario no encontrado",
      })
    }

    const usuario = results[0]

    const passwordValida = await bcrypt.compare(password, usuario.password)

    if (!passwordValida) {
      return res.status(401).json({
        mensaje: "Contraseña incorrecta",
      })
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      },
      SECRET_KEY,
      { expiresIn: "24h" }
    )

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        rol: usuario.rol,
      },
    })
  })
}

module.exports = {
  registrarUsuario,
  iniciarSesion,
}