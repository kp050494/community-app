import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { Loader2, ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/auth/auth-context"
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from "@/db/seed"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const ok = await login(email, password)
      if (ok) {
        navigate("/admin/dashboard", { replace: true })
      } else {
        setError("Invalid email or password")
        setIsLoading(false)
      }
    } catch {
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 gradient-animated opacity-90 z-0" />
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] z-0 animate-pulse-dot" />

      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass p-8 md:p-10 rounded-3xl premium-card backdrop-blur-2xl bg-card/60 border border-white/10 shadow-2xl"
        >
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-4 border border-primary/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">Admin Portal</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Sign in to manage the SKPPMM community (offline).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                placeholder={DEFAULT_ADMIN_EMAIL}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-4 font-bold rounded-xl btn-shimmer bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(212,168,83,0.3)] transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              First time? Sign in with{" "}
              <span className="font-mono text-foreground">{DEFAULT_ADMIN_EMAIL}</span> /{" "}
              <span className="font-mono text-foreground">{DEFAULT_ADMIN_PASSWORD}</span>, then change it in Settings.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
