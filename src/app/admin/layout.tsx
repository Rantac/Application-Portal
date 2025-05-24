
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
  // The 'next-url' header gives the path of the incoming request, e.g., /admin/login
  const nextUrlHeader = requestHeaders.get('next-url'); 
  let currentPathname = '';

  if (nextUrlHeader) {
    try {
      // Use URL constructor to reliably parse the pathname, even if nextUrlHeader contains query params
      // A base URL is required for the constructor if nextUrlHeader is just a path, but it's not used.
      const url = new URL(nextUrlHeader, 'http://localhost'); 
      currentPathname = url.pathname;
    } catch (e) {
      // Fallback in case of an unexpected format for next-url, though unlikely.
      console.error("Error parsing 'next-url' header in AdminLayout:", e);
      currentPathname = nextUrlHeader; // Use raw value as a fallback
    }
  }

  const authenticated = await isAuthenticated();

  // If not authenticated AND the current path is NOT /admin/login, then redirect to /admin/login
  if (!authenticated && currentPathname !== '/admin/login') {
    redirect('/admin/login');
  }

  // If authenticated AND trying to access /admin/login, redirect to dashboard.
  // This logic is also present in src/app/admin/login/page.tsx,
  // ensuring user is redirected to dashboard if they are already logged in.
  // Keeping it there is fine, as login/page.tsx is the entry point for login.
  // if (authenticated && currentPathname === '/admin/login') {
  //   redirect('/admin/dashboard');
  // }
  // No need for the above block here as src/app/admin/login/page.tsx handles it.

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
