import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken, encode } from "next-auth/jwt"

// 1-hour rolling session: idle longer than this and the admin must sign in again.
const SESSION_MAX_AGE = 60 * 60

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
    const secret = process.env.AUTH_SECRET as string

    const token = await getToken({
      req: request,
      secret,
      secureCookie: useSecureCookie,
      cookieName,
      salt: cookieName,
    })

    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Activity resets the timer: re-issue the session cookie with a fresh 1-hour expiry.
    const response = NextResponse.next()
    try {
      // Drop the old timing claims so encode sets fresh iat/exp.
      const { exp, iat, jti, ...payload } = token as Record<string, unknown>
      void exp; void iat; void jti
      const refreshed = await encode({
        token: payload,
        secret,
        salt: cookieName,
        maxAge: SESSION_MAX_AGE,
      })
      response.cookies.set(cookieName, refreshed, {
        httpOnly: true,
        secure: useSecureCookie,
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      })
    } catch {
      // If re-issuing fails, keep the existing cookie (it still expires on schedule).
    }
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
