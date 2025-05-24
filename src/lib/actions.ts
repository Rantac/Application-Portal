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
  redirect('/admin/login');
}

export async function addCategoryAction(
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
      message: 'Failed to create category. Please check your input.',
      success: false,
    };
  }
  
  try {
    const { name, logoUrl, logoAiHint, contentCount, contentLink } = validatedFields.data;
    await dataStore.addCategory({ name, logoUrl, logoAiHint, contentCount, contentLink });
  } catch (error) {
    return { message: 'Database Error: Failed to Create Category.', success: false };
  }

  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  // redirect('/admin/dashboard'); // Let client handle redirect
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
    const { name, logoUrl, logoAiHint, contentCount, contentLink } = validatedFields.data;
    await dataStore.updateCategory(id, { name, logoUrl, logoAiHint, contentCount, contentLink });
  } catch (error) {
    return { message: 'Database Error: Failed to Update Category.', success: false };
  }

  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  revalidatePath(`/admin/edit/${id}`);
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
  return { success: true, message: 'Category deleted successfully.' };
}
