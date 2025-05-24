'use client';

import { logoutAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useTransition } from 'react';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };
  
  return (
    <form action={handleLogout}>
      <Button type="submit" variant="ghost" className="text-primary-foreground hover:text-accent hover:bg-transparent" disabled={isPending} aria-disabled={isPending}>
        <LogOut className="mr-2 h-5 w-5" />
        {isPending ? 'Logging out...' : 'Logout'}
      </Button>
    </form>
  );
}
