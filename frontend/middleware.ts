import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserMeLoader } from "@/services/userService";

const protectedRoutes = [
  "/profile",
];

const adminRoutes = ["/profile/admin"];

const userRoutes = ["/signin", "/signup"];

function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some((route) => path.startsWith(route));
}


function isAdminRoute(path: string): boolean {
  return adminRoutes.some((route) => path.startsWith(route));
}


function isUserRoute(path: string): boolean {
  return userRoutes.some((route) => path.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt");
  const user = await getUserMeLoader();
  const currentPath = request.nextUrl.pathname;
  
  if (isProtectedRoute(currentPath) && user.ok === false) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (isAdminRoute(currentPath)) {
    if (!user.data?.role || user.data.role.type !== 'admin') {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }

  if (isUserRoute(currentPath) && user.ok === true) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Optionally, you can add a matcher to optimize performance
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};