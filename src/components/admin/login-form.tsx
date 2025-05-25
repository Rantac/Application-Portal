
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { loginAction } from '@/lib/actions';
import type { LoginFormState } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, LogIn, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';


export function AdminLoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const initialState: LoginFormState = { message: '', success: false };
  const [state, dispatch] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    if (state?.success) {
      toast({ title: "Login Successful", description: "Redirecting to dashboard..." });
      router.push('/admin/dashboard');
    } else if (state?.message && !state.success) {
       toast({ title: "Login Failed", description: state.message, variant: "destructive" });
    }
  }, [state, router, toast]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="bg-input/50 pr-10" // Add padding for the icon
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0 h-full px-3 text-muted-foreground hover:text-accent hover:bg-transparent"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
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
