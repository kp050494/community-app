import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const admin = await prisma.admin.findUnique({
          where: {
            email: credentials.email as string
          }
        })

        if (!admin || !admin.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          admin.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        }
      }
    })
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id as string
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as 'SUPER_ADMIN' | 'ADMIN'
        session.user.id = token.id as string
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,      // 1 hour — admin is signed out after this much inactivity
    updateAge: 5 * 60,    // re-issue the token at most every 5 min when active
  },
  secret: process.env.AUTH_SECRET,
})
