import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export function AddCategoryCard() {
  return (
    <Link href="/admin/add" className="frosted-glass rounded-xl shadow-lg hover:shadow-accent/30 transition-shadow duration-300 aspect-[4/3] flex flex-col items-center justify-center group border-2 border-dashed border-muted-foreground/50 hover:border-accent">
      <PlusCircle className="h-16 w-16 text-muted-foreground group-hover:text-accent transition-colors" />
      <p className="mt-4 text-lg font-semibold text-muted-foreground group-hover:text-accent transition-colors">Add New Lab</p>
    </Link>
  );
}
