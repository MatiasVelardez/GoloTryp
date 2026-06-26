const db = require("../db/database")

const crearUsuario = (usuario, callback) => {
  const { nombre, apellido, email, password, telefono, direccion } = usuario

  const query = `
    INSERT INTO usuarios
    (nombre, apellido, email, password, telefono, direccion)
    VALUES (?, ?, ?, ?, ?, ?)
  `

  db.query(
    query,
    [nombre, apellido, email, password, telefono, direccion],
    callback
  )
}

const buscarUsuarioPorEmail = (email, callback) => {
  const query = `
    SELECT *
    FROM usuarios
    WHERE email = ? AND activo = 1
  `

  db.query(query, [email], callback)
}

module.exports = {
  crearUsuario,
  buscarUsuarioPorEmail,
}