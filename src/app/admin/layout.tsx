
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
  let currentPathname = '';

  const nextUrlHeader = requestHeaders.get('next-url');
  const invokePathHeader = requestHeaders.get('x-invoke-path'); 

  if (nextUrlHeader) {
    try {
      const url = new URL(nextUrlHeader, 'http://localhost'); 
      currentPathname = url.pathname;
    } catch (e) {
      console.error("Error parsing 'next-url' header in AdminLayout:", e, "Header value:", nextUrlHeader);
      if (invokePathHeader) {
        currentPathname = invokePathHeader;
      } else {
        currentPathname = typeof nextUrlHeader === 'string' ? nextUrlHeader : ''; 
      }
    }
  } else if (invokePathHeader) {
    currentPathname = invokePathHeader;
  } else {
    console.warn("'next-url' and 'x-invoke-path' headers not found in AdminLayout. Path-based redirect logic might be affected. Current determined path (if any):", currentPathname);
  }

  const authenticated = await isAuthenticated();

  // If not authenticated AND the current path (within /admin/*) is NOT the main login page ('/'), 
  // then redirect to the main login page ('/').
  // Since this layout applies to /admin/* routes (e.g., /admin/dashboard),
  // currentPathname here will not be '/', so the check effectively becomes:
  // if not authenticated, redirect to '/'.
  if (!authenticated) {
    // The `currentPathname !== '/'` check is mostly for conceptual clarity that we don't redirect from the login page to itself,
    // though AdminLayout wouldn't typically be applied directly to `/`.
    // For paths like `/admin/dashboard`, `currentPathname` won't be `/`.
    if (currentPathname !== '/') { // This condition will be true for /admin/* paths.
        redirect('/');
    }
  }

  // The login page (now src/app/page.tsx) itself handles redirecting
  // authenticated users away from it to /admin/dashboard.

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
