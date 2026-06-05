import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/admin")) {
    // On HTTPS (e.g. Vercel) Auth.js stores the session in a "__Secure-" prefixed
    // cookie; getToken must be told the matching cookie name + salt or it finds nothing
    // and redirects authenticated users back to /login (infinite loading loop).
    const useSecureCookie =
      request.nextUrl.protocol === "https:" ||
      (process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "").startsWith("https://")
    const cookieName = useSecureCookie
      ? "__Secure-authjs.session-token"
      : "authjs.session-token"

    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: useSecureCookie,
      cookieName,
      salt: cookieName,
    })

    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
