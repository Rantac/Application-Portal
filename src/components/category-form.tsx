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
import { Textarea } from '@/components/ui/textarea'; // Assuming you might want a description field later
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
  
  // The way useActionState is used depends on whether an ID is passed to the action (for update)
  // or just previous state (for create)
  const [state, formAction] = useActionState(
    category?.id ? (prevState, formData) => action(category.id, prevState, formData) : action, 
    initialFormState
  );

  const { register, handleSubmit, formState: { errors: clientErrors } } = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: category?.name || '',
      logoUrl: category?.logoUrl || '',
      logoAiHint: category?.logoAiHint || '',
      contentCount: category?.contentCount || 0,
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
            {displayErrors?.name && <p className="text-sm text-destructive">{displayErrors.name.join ? displayErrors.name.join(', ') : displayErrors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input id="logoUrl" type="url" {...register("logoUrl")} placeholder="https://example.com/logo.png" className="bg-input/50" />
            {displayErrors?.logoUrl && <p className="text-sm text-destructive">{displayErrors.logoUrl.join ? displayErrors.logoUrl.join(', ') : displayErrors.logoUrl.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoAiHint">Logo AI Hint (for image search)</Label>
            <Input id="logoAiHint" {...register("logoAiHint")} placeholder="e.g., blue cube, abstract lines" className="bg-input/50" />
            {displayErrors?.logoAiHint && <p className="text-sm text-destructive">{displayErrors.logoAiHint.join ? displayErrors.logoAiHint.join(', ') : displayErrors.logoAiHint.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentCount">Content Count (Number of Labs)</Label>
            <Input id="contentCount" type="number" {...register("contentCount")} placeholder="e.g., 12" className="bg-input/50" />
            {displayErrors?.contentCount && <p className="text-sm text-destructive">{displayErrors.contentCount.join ? displayErrors.contentCount.join(', ') : displayErrors.contentCount.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentLink">Content Link (URL)</Label>
            <Input id="contentLink" type="url" {...register("contentLink")} placeholder="https://example.com/category-details" className="bg-input/50" />
            {displayErrors?.contentLink && <p className="text-sm text-destructive">{displayErrors.contentLink.join ? displayErrors.contentLink.join(', ') : displayErrors.contentLink.message}</p>}
          </div>
          
          {state?.message && !state.success && !state.errors?.general && (
             <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Operation Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
           {displayErrors?.general && <p className="text-sm text-destructive">{displayErrors.general.join ? displayErrors.general.join(', ') : displayErrors.general.message}</p>}


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
