
import Link from 'next/link';
import { Rocket, LogIn } from 'lucide-react';
import { LogoutButton } from '@/components/admin/logout-button';
import { isAuthenticated } from '@/auth';
import { Button } from '@/components/ui/button';

export async function Header() {
  const adminAuthenticated = await isAuthenticated();

  return (
    <header className="py-6 px-4 md:px-8 border-b border-border/50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary-foreground hover:text-accent transition-colors">
          <Rocket className="h-7 w-7 text-accent" />
          <span>LabLink</span>
        </Link>
        {adminAuthenticated ? (
          <LogoutButton />
        ) : (
          <Button asChild variant="ghost" className="text-primary-foreground hover:text-accent hover:bg-transparent">
            <Link href="/"> {/* Changed from /admin/login to / */}
              <LogIn className="mr-2 h-5 w-5" />
              Admin Portal
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
