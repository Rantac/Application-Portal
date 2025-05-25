'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { Category, CategoryFormData, CategoryFormState } from '@/lib/definitions';
import { CategorySchema } from '@/lib/definitions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea'; // Not currently used
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Save } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';

interface CategoryFormProps {
  category?: Category;
  action: (
    idOrPrevState: string | CategoryFormState | undefined,
    prevStateOrFormData: CategoryFormState | FormData | undefined,
    formData?: FormData
  ) => Promise<CategoryFormState>; // More flexible action prop
  formTitle: string;
  formDescription: string;
  submitButtonText: string;
}

export function CategoryForm({
  category,
  action,
  formTitle,
  formDescription,
  submitButtonText,
}: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const initialFormState: CategoryFormState = { message: '', success: false };
  
  const [state, formAction] = useActionState(
    category?.id ? (prevState, formData) => action(category.id, prevState, formData) : action, 
    initialFormState
  );

  const { register, handleSubmit, formState: { errors: clientErrors }, reset } = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: category?.name || '',
      logoUrl: category?.logoUrl || '',
      contentLink: category?.contentLink || '',
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast({ title: "Success", description: state.message || "Operation successful." });
      router.push('/admin/dashboard');
    } else if (state?.message && !state.success) {
      toast({ title: "Error", description: state.message, variant: "destructive" });
    }
  }, [state, router, toast]);

  useEffect(() => {
    // Reset form with category data when category prop changes (e.g., for edit page)
    if (category) {
      reset({
        name: category.name,
        logoUrl: category.logoUrl,
        contentLink: category.contentLink,
      });
    }
  }, [category, reset]);
  
  // Combine server and client errors for display
  const displayErrors = state?.errors || clientErrors;

  return (
    <Card className="w-full max-w-2xl mx-auto frosted-glass my-8">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Save className="h-6 w-6 text-accent" />
          {formTitle}
        </CardTitle>
        <CardDescription>{formDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input id="name" {...register("name")} placeholder="e.g., DevOps" className="bg-input/50" />
            {displayErrors?.name && <p className="text-sm text-destructive">{displayErrors.name.join ? displayErrors.name.join(', ') : (displayErrors.name as any).message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input id="logoUrl" type="url" {...register("logoUrl")} placeholder="https://example.com/logo.png" className="bg-input/50" />
            {displayErrors?.logoUrl && <p className="text-sm text-destructive">{displayErrors.logoUrl.join ? displayErrors.logoUrl.join(', ') : (displayErrors.logoUrl as any).message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentLink">Content Link (URL)</Label>
            <Input id="contentLink" type="url" {...register("contentLink")} placeholder="https://example.com/category-details" className="bg-input/50" />
            {displayErrors?.contentLink && <p className="text-sm text-destructive">{displayErrors.contentLink.join ? displayErrors.contentLink.join(', ') : (displayErrors.contentLink as any).message}</p>}
          </div>
          
          {state?.message && !state.success && !state.errors?.general && (
             <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Operation Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
           {displayErrors?.general && <p className="text-sm text-destructive">{displayErrors.general.join ? displayErrors.general.join(', ') : (displayErrors.general as any).message}</p>}


          <SubmitButton text={submitButtonText} />
        </form>
      </CardContent>
    </Card>
  );
}

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending} aria-disabled={pending}>
      {pending ? 'Saving...' : text}
    </Button>
  );
}
