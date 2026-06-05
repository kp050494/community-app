import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/auth/auth-context"
import { RequireAuth } from "@/auth/require-auth"
import { AdminLayout } from "@/components/layout/admin-layout"
import LoginPage from "@/pages/login"
import DashboardPage from "@/pages/dashboard"
import MembersPage from "@/pages/members"
import FamiliesPage from "@/pages/families"
import SettingsPage from "@/pages/settings"

export default function App() {
  return (
    <AuthProvider>
      {/* HashRouter works from a file:// origin inside the Android WebView. */}
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<RequireAuth />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="families" element={<FamiliesPage />} />
              <Route path="members" element={<MembersPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
