
import { CategoryGrid } from '@/components/category-grid';
import { getCategories } from '@/lib/data';

export const revalidate = 0; // Ensure fresh data on every load

export default async function AdminDashboardPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex justify-between items-center p-4 md:p-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
         {/* The "Add New Lab" card is now part of CategoryGrid when isAdmin is true */}
      </div>
      <CategoryGrid categories={categories} isAdmin={true} />
    </div>
  );
}
