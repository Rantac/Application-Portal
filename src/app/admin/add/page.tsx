import { CategoryForm } from '@/components/category-form';
import { addCategoryAction } from '@/lib/actions';

export default function AddCategoryPage() {
  return (
    <CategoryForm
      action={addCategoryAction as any} // Cast because addCategoryAction doesn't take ID as first param
      formTitle="Add New Lab Category"
      formDescription="Fill in the details for the new lab category."
      submitButtonText="Create Category"
    />
  );
}
