import { AdminLoginForm } from '@/components/admin/login-form';
import { isAuthenticated } from '@/auth';
import { redirect } from 'next/navigation';
import { Rocket } from 'lucide-react';

export default async function LoginPage() {
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
       </div>
      <AdminLoginForm />
    </div>
  );
}

// Added missing import
import Link from 'next/link';
