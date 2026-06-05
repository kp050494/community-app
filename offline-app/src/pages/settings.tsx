import { useRef, useState } from "react"
import { Loader2, KeyRound, Download, Upload, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/auth/auth-context"
import { changePassword } from "@/db/auth-service"
import { downloadBackup, importBackup } from "@/db/backup"
import { ApiError } from "@/db/errors"

type Toast = { kind: "ok" | "err"; text: string } | null

function Notice({ toast }: { toast: Toast }) {
  if (!toast) return null
  const ok = toast.kind === "ok"
  return (
    <div
      className={
        "rounded-lg px-4 py-3 text-sm border " +
        (ok
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          : "bg-destructive/10 border-destructive/20 text-destructive")
      }
    >
      {toast.text}
    </div>
  )
}

export default function SettingsPage() {
  const { admin } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)

  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")
  const [savingPw, setSavingPw] = useState(false)
  const [pwToast, setPwToast] = useState<Toast>(null)

  const [dataToast, setDataToast] = useState<Toast>(null)
  const [importing, setImporting] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwToast(null)
    if (next !== confirm) {
      setPwToast({ kind: "err", text: "New password and confirmation don't match." })
      return
    }
    if (!admin) return
    setSavingPw(true)
    try {
      await changePassword(admin.id, current, next)
      setCurrent("")
      setNext("")
      setConfirm("")
      setPwToast({ kind: "ok", text: "Password updated successfully." })
    } catch (err) {
      const text = err instanceof ApiError || err instanceof Error ? err.message : "Failed to update password."
      setPwToast({ kind: "err", text })
    } finally {
      setSavingPw(false)
    }
  }

  const handleExport = async () => {
    setDataToast(null)
    try {
      await downloadBackup()
      setDataToast({ kind: "ok", text: "Backup file downloaded." })
    } catch {
      setDataToast({ kind: "err", text: "Could not create backup." })
    }
  }

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    if (!window.confirm("Importing will REPLACE all current data on this device. Continue?")) return
    setImporting(true)
    setDataToast(null)
    try {
      const text = await file.text()
      await importBackup(text)
      setDataToast({ kind: "ok", text: "Backup imported. Reloading…" })
      setTimeout(() => window.location.reload(), 800)
    } catch (err) {
      const text = err instanceof Error ? err.message : "Failed to import backup."
      setDataToast({ kind: "err", text })
      setImporting(false)
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-heading">Settings</h2>
        <p className="text-muted-foreground">Manage your admin account and on-device data.</p>
      </div>

      {/* Account */}
      <section className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold font-heading text-foreground">Change Password</h3>
            <p className="text-xs text-muted-foreground">Signed in as {admin?.email}</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <Notice toast={pwToast} />
          <div className="grid gap-4">
            <input
              type="password"
              placeholder="Current password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
            />
            <input
              type="password"
              placeholder="New password (min 6 characters)"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
            />
          </div>
          <Button type="submit" disabled={savingPw} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {savingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
          </Button>
        </form>
      </section>

      {/* Backup / Restore */}
      <section className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold font-heading text-foreground">Backup &amp; Restore</h3>
            <p className="text-xs text-muted-foreground">
              Data lives only on this device. Export regularly, or import to move it to another phone.
            </p>
          </div>
        </div>

        <Notice toast={dataToast} />

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={handleExport} className="bg-background/50">
            <Download className="w-4 h-4 mr-2" /> Export backup (.json)
          </Button>
          <Button
            variant="outline"
            onClick={() => fileRef.current?.click()}
            disabled={importing}
            className="bg-background/50"
          >
            {importing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            Import backup (.json)
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImportFile}
          />
        </div>
      </section>
    </div>
  )
}
