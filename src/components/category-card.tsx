'use client';

import type { Category } from '@/lib/definitions';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCategoryAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState, useTransition } from 'react';

interface CategoryCardProps {
  category: Category;
  isAdmin?: boolean;
}

export function CategoryCard({ category, isAdmin = false }: CategoryCardProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCategoryAction(category.id);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Category deleted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete category.",
          variant: "destructive",
        });
      }
      setIsDeleteDialogOpen(false);
    });
  };

  const cardContent = (
    <div className="p-6 flex flex-col h-full group relative">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-foreground">{category.name}</h3>
        <Image
          src={category.logoUrl}
          alt={`${category.name} logo`}
          width={48}
          height={48}
          className="rounded-md object-contain"
          data-ai-hint={category.logoAiHint || 'technology logo'}
        />
      </div>
      <div className="mt-auto flex justify-between items-end">
        <span className="text-sm text-muted-foreground">{category.contentCount} Labs</span>
        {!isAdmin && (
          <ArrowRight className="h-5 w-5 text-accent group-hover:translate-x-1 transition-transform" />
        )}
      </div>
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button variant="outline" size="icon" asChild className="bg-background/70 hover:bg-accent/70">
            <Link href={`/admin/edit/${category.id}`} aria-label={`Edit ${category.name}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon" className="bg-destructive/70 hover:bg-destructive" aria-label={`Delete ${category.name}`}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  category "{category.name}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                  {isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );

  return (
    <div className="frosted-glass rounded-xl shadow-lg hover:shadow-accent/30 transition-shadow duration-300 aspect-[4/3] flex flex-col">
      {isAdmin || !category.contentLink ? (
        cardContent
      ) : (
        <Link href={category.contentLink} target="_blank" rel="noopener noreferrer" className="block h-full">
          {cardContent}
        </Link>
      )}
    </div>
  );
}
