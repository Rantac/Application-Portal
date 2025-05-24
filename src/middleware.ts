
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { AUTH_COOKIE_NAME } from '@/lib/constants';

// Example of a potential authentication middleware (currently commented out):
// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Check if the path is an admin path
//   if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
//     const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME);
//     if (!sessionCookie || sessionCookie.value !== 'true') {
//       // Redirect to login page if not authenticated
//       const loginUrl = new URL('/admin/login', request.url)
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   // If on login page and already authenticated, redirect to dashboard
//   if (pathname === '/admin/login') {
//     const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME);
//     if (sessionCookie && sessionCookie.value === 'true') {
//       const dashboardUrl = new URL('/admin/dashboard', request.url)
//       return NextResponse.redirect(dashboardUrl);
//     }
//   }

//   return NextResponse.next();
// }

// // Example config for the authentication middleware (currently commented out):
// export const config = {
//   matcher: ['/admin/:path*'],
// };

// This file is provided as an example. For this scaffold, authentication is handled in AdminLayout.
// If you prefer middleware-based protection, uncomment and adapt this file.
// Remember to remove or adjust the auth checks in src/app/admin/layout.tsx if using this.

// Active no-op middleware function (now a named export).
// This function must be present if the file src/middleware.ts exists.
// It currently does nothing and allows all requests to pass through.
// To enable the example authentication middleware, comment out or remove this function,
// and uncomment the 'middleware' function and 'config' object above.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}
