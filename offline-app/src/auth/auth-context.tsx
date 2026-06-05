import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { ensureSeeded } from "@/db/seed"
import { verifyCredentials, getAdminById, type PublicAdmin } from "@/db/auth-service"

const SESSION_KEY = "skppmm.session.adminId"

interface AuthContextValue {
  admin: PublicAdmin | null
  ready: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<PublicAdmin | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await ensureSeeded()
      const savedId = localStorage.getItem(SESSION_KEY)
      if (savedId) {
        const restored = await getAdminById(savedId)
        if (!cancelled && restored) setAdmin(restored)
      }
      if (!cancelled) setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function login(email: string, password: string): Promise<boolean> {
    const result = await verifyCredentials(email, password)
    if (!result) return false
    localStorage.setItem(SESSION_KEY, result.id)
    setAdmin(result)
    return true
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
