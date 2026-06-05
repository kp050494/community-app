import { Navigate, Outlet } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useAuth } from "./auth-context"

export function RequireAuth() {
  const { admin, ready } = useAuth()

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!admin) return <Navigate to="/login" replace />

  return <Outlet />
}
