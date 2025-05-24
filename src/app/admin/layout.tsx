import { isAuthenticated } from '@/auth';
import { redirect } from 'next/navigation';
import { Header } from '@/components/header';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect('/admin/login');
  }

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
