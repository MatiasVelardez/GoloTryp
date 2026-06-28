import { BrowserRouter, Routes, Route } from "react-router-dom"
import CatalogPage from "./pages/CatalogPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import EmpleadoPage from "./pages/EmpleadoPage"
import AdminPage from "./pages/AdminPage"
import ProtectedRoute from "./routes/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        <Route
          path="/empleado"
          element={
            <ProtectedRoute roles={["empleado", "administrador"]}>
              <EmpleadoPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["administrador"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App