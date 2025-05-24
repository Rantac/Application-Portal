
import { AdminLoginForm } from '@/components/admin/login-form';
import { isAuthenticated } from '@/auth';
import { redirect } from 'next/navigation';
import { Rocket, Users } from 'lucide-react';
import Link from 'next/link';

export default async function RootAdminLoginPage() {
  if (await isAuthenticated()) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="text-center mb-8">
        <Link href="/" className="flex items-center justify-center gap-2 text-4xl font-bold text-primary-foreground hover:text-accent transition-colors">
          <Rocket className="h-10 w-10 text-accent" />
          <span>LabLink</span>
        </Link>
        <p className="text-muted-foreground mt-2">Admin Portal</p>
      </div>
      <AdminLoginForm />
      <div className="mt-8 text-center">
        <Link href="/user-portal" className="text-accent hover:underline flex items-center justify-center gap-2 p-2 rounded-md hover:bg-accent/10 transition-colors">
          <Users className="h-5 w-5" />
          Go to User Portal
        </Link>
      </div>
    </div>
  );
}
