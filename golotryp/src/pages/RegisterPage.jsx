import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    direccion: "",
    barrio: "",
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    fetch("http://localhost:3000/usuarios/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ER_DUP_ENTRY") {
          alert("Ese email ya está registrado")
          return
        }

        alert(data.mensaje || "Usuario registrado correctamente")
        navigate("/login")
      })
      .catch((error) => {
        console.log(error)
        alert("Error al registrar usuario")
      })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm"
      >
        <h1 className="mb-6 text-center text-2xl font-bold text-blue-900">
          Crear cuenta
        </h1>

        <div className="grid gap-4 md:grid-cols-2">
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="rounded-lg border px-3 py-2" />
          <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} className="rounded-lg border px-3 py-2" />
        </div>

        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="mt-4 w-full rounded-lg border px-3 py-2" />
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} className="mt-4 w-full rounded-lg border px-3 py-2" />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} className="mt-4 w-full rounded-lg border px-3 py-2" />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} className="mt-4 w-full rounded-lg border px-3 py-2" />
        <input name="barrio" placeholder="Barrio" value={form.barrio} onChange={handleChange} className="mt-4 w-full rounded-lg border px-3 py-2" />

        <button className="mt-6 w-full rounded-lg bg-blue-900 py-2 font-semibold text-white hover:bg-blue-800">
          Registrarme
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="font-semibold text-blue-900">
            Iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterPage