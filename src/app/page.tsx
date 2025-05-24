import { CategoryGrid } from '@/components/category-grid';
import { Header } from '@/components/header';
import { getCategories } from '@/lib/data';

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto">
        <CategoryGrid categories={categories} />
      </main>
      <footer className="py-6 text-center text-muted-foreground">
        © {new Date().getFullYear()} LabLink. All rights reserved.
      </footer>
    </div>
  );
}
