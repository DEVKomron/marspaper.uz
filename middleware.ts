import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const adminSession = request.cookies.get("admin_session")?.value
  const { pathname } = request.nextUrl

  // Admin yo'nalishlarini himoyalash
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!adminSession) {
      // Agar autentifikatsiya qilinmagan bo'lsa, login sahifasiga yo'naltirish
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Agar autentifikatsiya qilingan bo'lsa va login sahifasiga kirishga harakat qilsa, admin paneliga yo'naltirish
  if (pathname === "/admin/login" && adminSession) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
}
