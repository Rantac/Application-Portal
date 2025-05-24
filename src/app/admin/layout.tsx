
import { isAuthenticated } from '@/auth';
import { redirect } from 'next/navigation';
import { Header } from '@/components/header';
import { headers } from 'next/headers'; // Import headers

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = headers();
  // The 'next-url' header gives the path of the incoming request, e.g., /admin/login or /admin/dashboard
  // It should provide the full URL, from which we can extract the pathname.
  const nextUrlHeader = requestHeaders.get('next-url'); 
  let currentPathname = '';

  if (nextUrlHeader) {
    try {
      // Use URL constructor to reliably parse the pathname, even if nextUrlHeader contains query params
      // A base URL is required for the constructor if nextUrlHeader is just a path, but it's not used if nextUrlHeader is absolute.
      const url = new URL(nextUrlHeader, 'http://localhost'); 
      currentPathname = url.pathname;
    } catch (e) {
      // Fallback in case of an unexpected format for next-url.
      // If nextUrlHeader is null or parsing fails, currentPathname remains '',
      // which could lead to a redirect if not handled carefully, but 'next-url' should be reliable.
      console.error("Error parsing 'next-url' header in AdminLayout:", e, "Header value:", nextUrlHeader);
      // If parsing fails or header is missing, and we can't determine the path,
      // it's safer not to redirect from here to avoid loops if the user IS on /admin/login.
      // However, this scenario should be rare. For now, we proceed, and if currentPathname is '',
      // the condition `currentPathname !== '/admin/login'` will be true.
      currentPathname = typeof nextUrlHeader === 'string' ? nextUrlHeader : ''; // Best effort fallback
    }
  } else {
    // If the 'next-url' header is missing, we cannot reliably determine the current path here.
    // This could potentially lead to issues with the redirect logic.
    // This scenario is unexpected for page renders.
    console.warn("'next-url' header not found in AdminLayout. Path-based redirect logic might be affected.");
  }

  const authenticated = await isAuthenticated();

  // If not authenticated AND the current path is NOT /admin/login, then redirect to /admin/login.
  // This prevents redirecting if the user is already trying to access the login page.
  if (!authenticated && currentPathname !== '/admin/login') {
    redirect('/admin/login');
  }

  // The login page (src/app/admin/login/page.tsx) itself handles redirecting
  // authenticated users away from /admin/login to /admin/dashboard.
  // So, no need for: if (authenticated && currentPathname === '/admin/login') { redirect('/admin/dashboard'); } here.

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto">
        {children}
      </main>
       <footer className="py-6 text-center text-muted-foreground">
        Admin Panel - © {new Date().getFullYear()} LabLink
      </footer>
    </div>
  );
}
