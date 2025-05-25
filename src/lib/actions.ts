'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { LoginSchema, CategorySchema, type LoginFormState, type CategoryFormState } from './definitions';
import type { Category } from './definitions';
import * as dataStore from './data';
import { verifyCredentials, setSessionCookie, clearSessionCookie, isAuthenticated } from '@/auth';

export async function loginAction(
  prevState: LoginFormState | undefined,
  formData: FormData
): Promise<LoginFormState> {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Login failed. Please check your input.',
      success: false,
    };
  }

  const { username, password } = validatedFields.data;

  const isValid = await verifyCredentials(username, password);

  if (!isValid) {
    return {
      message: 'Invalid username or password.',
      success: false,
    };
  }

  await setSessionCookie();
  // Do not redirect here, let the client component handle it after state update
  // redirect('/admin/dashboard'); // This causes "Error: NEXT_REDIRECT" if called directly in action that updates state
  return { message: 'Login successful!', success: true };
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect('/'); // Redirect to main login page
}

export async function addCategoryAction(
  prevState: CategoryFormState | undefined,
  formData: FormData
): Promise<CategoryFormState> {
  console.log('[Action] addCategoryAction: Received form data.');
  if (!(await isAuthenticated())) {
    console.log('[Action] addCategoryAction: User not authenticated.');
    return { message: 'Unauthorized.', success: false };
  }

  const validatedFields = CategorySchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    console.log('[Action] addCategoryAction: Validation failed.', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create category. Please check your input.',
      success: false,
    };
  }
  
  try {
    const { name, logoUrl, contentLink } = validatedFields.data;
    console.log('[Action] addCategoryAction: Validated data to add:', { name, logoUrl, contentLink });
    const newCategory = await dataStore.addCategory({ name, logoUrl, contentLink });
    console.log('[Action] addCategoryAction: Result from dataStore.addCategory:', newCategory);
  } catch (error) {
    console.error('[Action] addCategoryAction: Database Error:', error);
    return { message: 'Database Error: Failed to Create Category.', success: false };
  }

  console.log('[Action] addCategoryAction: Revalidating paths.');
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  revalidatePath('/user-portal');
  // redirect('/admin/dashboard'); // Let client handle redirect
  console.log('[Action] addCategoryAction: Category creation successful.');
  return { message: 'Category created successfully!', success: true };
}

export async function updateCategoryAction(
  id: string,
  prevState: CategoryFormState | undefined,
  formData: FormData
): Promise<CategoryFormState> {
   if (!(await isAuthenticated())) {
    return { message: 'Unauthorized.', success: false };
  }
  const validatedFields = CategorySchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update category. Please check your input.',
      success: false,
    };
  }

  try {
    const { name, logoUrl, contentLink } = validatedFields.data;
    await dataStore.updateCategory(id, { name, logoUrl, contentLink });
  } catch (error) {
    return { message: 'Database Error: Failed to Update Category.', success: false };
  }

  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  revalidatePath(`/admin/edit/${id}`);
  revalidatePath('/user-portal');
  // redirect('/admin/dashboard'); // Let client handle redirect
  return { message: 'Category updated successfully!', success: true };
}

export async function deleteCategoryAction(id: string): Promise<{ success: boolean; message?: string }> {
  if (!(await isAuthenticated())) {
    return { message: 'Unauthorized.', success: false };
  }
  try {
    const success = await dataStore.deleteCategory(id);
    if (!success) {
       return { message: 'Failed to delete category. Category not found.', success: false };
    }
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Category.', success: false };
  }

  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  revalidatePath('/user-portal');
  return { success: true, message: 'Category deleted successfully.' };
}
