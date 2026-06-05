// Module-level in-memory cache so navigating back to an admin page is instant.
// Data is shown immediately from cache while a background revalidation runs.

type CacheEntry = { data: any; ts: number }
const store = new Map<string, CacheEntry>()
const TTL = 30_000 // 30 seconds

export function getCached(key: string): any | null {
  const entry = store.get(key)
  if (!entry) return null
  if (Date.now() - entry.ts > TTL) { store.delete(key); return null }
  return entry.data
}

export function setCached(key: string, data: any) {
  store.set(key, { data, ts: Date.now() })
}

export function invalidateCache(prefix: string) {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key)
  }
}
