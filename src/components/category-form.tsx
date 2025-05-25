'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Category, CategoryFormData, CategoryFormState } from '@/lib/definitions';
import { CategorySchema } from '@/lib/definitions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Save, UploadCloud } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';

interface CategoryFormProps {
  category?: Category;
  action: (
    idOrPrevState: string | CategoryFormState | undefined,
    prevStateOrFormData: CategoryFormState | FormData | undefined,
    formData?: FormData
  ) => Promise<CategoryFormState>;
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
  const [logoPreview, setLogoPreview] = useState<string | null>(category?.logoUrl || null);

  const initialFormState: CategoryFormState = { message: '', success: false };
  
  const [state, formAction] = useActionState(
    category?.id ? (prevState, formData) => action(category.id, prevState, formData) : action, 
    initialFormState
  );

  const { register, handleSubmit, formState: { errors: clientErrors }, reset, setValue, watch } = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: category?.name || '',
      logoUrl: category?.logoUrl || '', // This will hold the data URI or original URL
      contentLink: category?.contentLink || '',
    },
  });

  const currentLogoUrl = watch('logoUrl');

  useEffect(() => {
    if (currentLogoUrl && (currentLogoUrl.startsWith('data:image/') || currentLogoUrl.startsWith('http'))) {
      setLogoPreview(currentLogoUrl);
    } else if (!currentLogoUrl && category?.logoUrl) {
      // If currentLogoUrl is cleared but there was an original category.logoUrl (e.g. user cleared file input after initial load with existing image)
      // We might want to reset preview to original. Or handle this in handleFileChange.
      // For now, if currentLogoUrl is falsy, preview is null.
      setLogoPreview(category.logoUrl);
    } else {
       setLogoPreview(null);
    }
  }, [currentLogoUrl, category?.logoUrl]);


  useEffect(() => {
    if (state?.success) {
      toast({ title: "Success", description: state.message || "Operation successful." });
      router.push('/admin/dashboard');
    } else if (state?.message && !state.success) {
      toast({ title: "Error", description: state.message, variant: "destructive" });
    }
  }, [state, router, toast]);

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        logoUrl: category.logoUrl,
        contentLink: category.contentLink,
      });
      setLogoPreview(category.logoUrl); // Ensure preview is set on edit
    } else {
      reset({ name: '', logoUrl: '', contentLink: ''}); // Clear form for 'add'
      setLogoPreview(null);
    }
  }, [category, reset]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('logoUrl', reader.result as string, { shouldValidate: true });
        // Preview updates via watch('logoUrl') useEffect
      };
      reader.readAsDataURL(file);
    } else {
      // If user deselects file, set logoUrl back to original if editing, or empty if adding
      setValue('logoUrl', category?.logoUrl || '', { shouldValidate: true });
    }
  };
  
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
            <Label htmlFor="logoUpload">Category Logo</Label>
            <div className="flex items-center gap-4">
              {logoPreview && (
                <Image 
                  src={logoPreview} 
                  alt="Logo preview" 
                  width={64} 
                  height={64} 
                  className="rounded-md object-contain border border-border"
                  data-ai-hint="logo icon"
                />
              )}
               {!logoPreview && (
                 <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-md border border-border">
                    <UploadCloud className="w-8 h-8 text-muted-foreground" />
                 </div>
               )}
              <Input 
                id="logoUpload" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="bg-input/50 flex-grow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
            {/* Hidden input to store the logoUrl value (data URI or existing URL) for RHF submission */}
            <input type="hidden" {...register("logoUrl")} />
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
