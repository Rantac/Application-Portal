'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { loginAction } from '@/lib/actions';
import type { LoginFormState } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, LogIn } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';


export function AdminLoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const initialState: LoginFormState = { message: '', success: false };
  const [state, dispatch] = useFormState(loginAction, initialState);
  
  useEffect(() => {
    if (state?.success) {
      toast({ title: "Login Successful", description: "Redirecting to dashboard..." });
      router.push('/admin/dashboard');
    } else if (state?.message && !state.success) {
       toast({ title: "Login Failed", description: state.message, variant: "destructive" });
    }
  }, [state, router, toast]);

  return (
    <Card className="w-full max-w-md mx-auto frosted-glass">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <LogIn className="h-6 w-6 text-accent" />
          Admin Login
        </CardTitle>
        <CardDescription>Enter your admin credentials to access the dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="admin"
              required
              className="bg-input/50"
            />
            {state?.errors?.username && (
              <p className="text-sm text-destructive">{state.errors.username.join(', ')}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="bg-input/50"
            />
            {state?.errors?.password && (
              <p className="text-sm text-destructive">{state.errors.password.join(', ')}</p>
            )}
          </div>
          
          {state?.message && !state.success && !state.errors && (
             <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Login Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending} aria-disabled={pending}>
      {pending ? 'Logging in...' : 'Login'}
    </Button>
  );
}
