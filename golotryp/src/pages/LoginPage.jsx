import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    fetch("http://localhost:3000/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.token) {
          alert(data.mensaje || "Error al iniciar sesión")
          return
        }

        login(data.usuario, data.token)
        navigate("/")
      })
      .catch((error) => {
        console.log(error)
        alert("Error al conectar con el servidor")
      })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm"
      >
        <h1 className="mb-6 text-center text-2xl font-bold text-blue-900">
          Iniciar sesión
        </h1>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tuemail@email.com"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>

        <button className="w-full rounded-lg bg-blue-900 py-2 font-semibold text-white hover:bg-blue-800">
          Entrar
        </button>
      </form>
    </div>
  )
}

export default LoginPage