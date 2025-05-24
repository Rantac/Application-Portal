import { CategoryForm } from '@/components/category-form';
import { updateCategoryAction } from '@/lib/actions';
import { getCategoryById } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <CategoryForm
      category={category}
      action={updateCategoryAction as any} // Cast for the action signature
      formTitle="Edit Lab Category"
      formDescription={`Update the details for the lab category: ${category.name}.`}
      submitButtonText="Save Changes"
    />
  );
}
