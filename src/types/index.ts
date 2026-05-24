import { type DefaultSession } from "next-auth"
import { type JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "SUPER_ADMIN" | "ADMIN"
    } & DefaultSession["user"]
  }
  interface User {
    role: "SUPER_ADMIN" | "ADMIN"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "SUPER_ADMIN" | "ADMIN"
  }
}

export interface DashboardStats {
  totalMembers: number
  activeMembers: number
  adultMembers: number
  totalFamilies: number
  upcomingEvents: number
  activeNotices: number
  annualFeeCollected: number
  annualFeePending: number
  eventFeeCollected: number
}

export interface PaginationParams {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
