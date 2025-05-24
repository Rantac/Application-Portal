import type { Category } from '@/lib/definitions';
import { CategoryCard } from './category-card';
import { AddCategoryCard } from '@/components/admin/add-category-card';

interface CategoryGridProps {
  categories: Category[];
  isAdmin?: boolean;
}

export function CategoryGrid({ categories, isAdmin = false }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 md:p-8">
      {isAdmin && <AddCategoryCard />}
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} isAdmin={isAdmin} />
      ))}
    </div>
  );
}
