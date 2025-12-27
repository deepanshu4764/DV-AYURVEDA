import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role as string | undefined;

    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if ((pathname.startsWith("/checkout") || pathname.startsWith("/account")) && !req.nextauth.token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }
        if (path.startsWith("/checkout") || path.startsWith("/account")) {
          return !!token;
        }
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/checkout", "/account/:path*"],
};
