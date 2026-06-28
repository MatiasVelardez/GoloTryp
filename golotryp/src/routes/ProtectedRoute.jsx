import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function ProtectedRoute({ children, roles = [] }) {
  const { user } = useAuth()

  // No está logueado
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Tiene que tener alguno de los roles permitidos
  if (roles.length > 0 && !roles.includes(user.rol)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600">
          No tenés permisos para acceder.
        </h1>
      </div>
    )
  }

  return children
}

export default ProtectedRoute