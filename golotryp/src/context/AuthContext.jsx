import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("golotryp_user")
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem("golotryp_token")
  })

  const login = (userData, tokenData) => {
    setUser(userData)
    setToken(tokenData)

    localStorage.setItem("golotryp_user", JSON.stringify(userData))
    localStorage.setItem("golotryp_token", tokenData)
  }

  const logout = () => {
    setUser(null)
    setToken(null)

    localStorage.removeItem("golotryp_user")
    localStorage.removeItem("golotryp_token")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}