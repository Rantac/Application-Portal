
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
  const invokePathHeader = requestHeaders.get('x-invoke-path'); // Often contains just the pathname

  if (nextUrlHeader) {
    try {
      // Use URL constructor to reliably parse the pathname.
      // A base URL is required if nextUrlHeader is just a path (e.g., /admin/login).
      // If nextUrlHeader is a full URL (e.g., http://host/admin/login), the base is ignored.
      const url = new URL(nextUrlHeader, 'http://localhost'); 
      currentPathname = url.pathname;
    } catch (e) {
      console.error("Error parsing 'next-url' header in AdminLayout:", e, "Header value:", nextUrlHeader);
      // If next-url parsing fails, try invokePathHeader if currentPathname is still empty and invokePathHeader exists
      if (invokePathHeader) {
        currentPathname = invokePathHeader;
      } else {
        // Fallback to using nextUrlHeader as string if it's a string, otherwise empty
        currentPathname = typeof nextUrlHeader === 'string' ? nextUrlHeader : ''; 
      }
    }
  } else if (invokePathHeader) {
    currentPathname = invokePathHeader;
    // console.log("AdminLayout: Used 'x-invoke-path' as fallback for current pathname:", currentPathname); // Optional: for debugging
  } else {
    console.warn("'next-url' and 'x-invoke-path' headers not found in AdminLayout. Path-based redirect logic might be affected. Current determined path (if any):", currentPathname);
    // currentPathname remains '', as initialized, if both headers are missing.
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
