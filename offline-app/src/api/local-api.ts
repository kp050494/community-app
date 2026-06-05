// Local "API" — intercepts the bare `fetch('/api/...')` calls made by the ported
// web components and serves them from the on-device Dexie database instead of a
// server. This lets the original client components run unchanged and fully offline.

import { ApiError } from "@/db/errors"
import {
  listMembers,
  createMember,
  updateMember,
  deleteMember,
} from "@/db/members"
import {
  listFamilies,
  createFamily,
  updateFamily,
  deleteFamily,
} from "@/db/families"
import { getDashboardStats } from "@/db/stats"

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

async function handle(method: string, url: URL, init?: RequestInit): Promise<Response> {
  const path = url.pathname.replace(/\/$/, "")
  const q = url.searchParams
  const body = init?.body ? JSON.parse(init.body as string) : undefined

  // ── Members ──────────────────────────────────────────────────────────────
  if (path === "/api/members") {
    if (method === "GET") {
      return json(
        await listMembers({
          page: parseInt(q.get("page") || "1"),
          limit: parseInt(q.get("limit") || "10"),
          search: q.get("search") || "",
          familyId: q.get("familyId") || "",
        }),
      )
    }
    if (method === "POST") return json(await createMember(body), 201)
  }

  const memberMatch = path.match(/^\/api\/members\/([^/]+)$/)
  if (memberMatch) {
    const id = decodeURIComponent(memberMatch[1])
    if (method === "PATCH" || method === "PUT") return json(await updateMember(id, body))
    if (method === "DELETE") {
      await deleteMember(id)
      return json({ success: true })
    }
  }

  // ── Families ─────────────────────────────────────────────────────────────
  if (path === "/api/families") {
    if (method === "GET") return json(await listFamilies())
    if (method === "POST") return json(await createFamily(body), 201)
  }

  const familyMatch = path.match(/^\/api\/families\/([^/]+)$/)
  if (familyMatch) {
    const id = decodeURIComponent(familyMatch[1])
    if (method === "PATCH" || method === "PUT") return json(await updateFamily(id, body))
    if (method === "DELETE") {
      await deleteFamily(id)
      return json({ success: true })
    }
  }

  // ── Dashboard stats ──────────────────────────────────────────────────────
  if (path === "/api/admin/stats" && method === "GET") {
    return json({ success: true, data: await getDashboardStats() })
  }

  return json({ error: `No local route for ${method} ${path}` }, 404)
}

/** Install a global fetch shim that resolves /api/* locally. Call once at startup. */
export function installLocalApi(): void {
  const originalFetch = window.fetch.bind(window)

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const rawUrl =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url
    const method = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase()

    // Only intercept our own API paths; everything else hits the real fetch.
    const isApi = rawUrl.startsWith("/api/") || rawUrl.includes("/api/")
    if (!isApi) return originalFetch(input as RequestInfo, init)

    const url = new URL(rawUrl, window.location.origin)
    if (!url.pathname.startsWith("/api/")) return originalFetch(input as RequestInfo, init)

    try {
      // Merge body from a Request object if present.
      let effectiveInit = init
      if (input instanceof Request && !init?.body) {
        const text = await input.clone().text().catch(() => "")
        effectiveInit = { ...init, method, body: text || undefined }
      }
      return await handle(method, url, effectiveInit)
    } catch (err) {
      const status = err instanceof ApiError ? err.status : 500
      const message = err instanceof Error ? err.message : "Internal error"
      return json({ error: message }, status)
    }
  }
}
