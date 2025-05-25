import type { Category } from './definitions';

// In-memory store for categories
let categories: Category[] = [
  {
    id: '1',
    name: 'DevOps',
    logoUrl: 'https://placehold.co/64x64.png',
    contentLink: 'https://example.com/devops',
  },
  {
    id: '2',
    name: 'Kubernetes',
    logoUrl: 'https://placehold.co/64x64.png',
    contentLink: 'https://example.com/kubernetes',
  },
  {
    id: '3',
    name: 'Linux',
    logoUrl: 'https://placehold.co/64x64.png',
    contentLink: 'https://example.com/linux',
  },
  {
    id: '4',
    name: 'Cloud Computing',
    logoUrl: 'https://placehold.co/64x64.png',
    contentLink: 'https://example.com/cloud',
  },
];

// Simulate database operations
export async function getCategories(): Promise<Category[]> {
  console.log('[Data] getCategories: Fetching categories. Current count:', categories.length);
  // Simulate network delay
  // await new Promise(resolve => setTimeout(resolve, 500));
  return JSON.parse(JSON.stringify(categories)); // Return a deep copy
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  // await new Promise(resolve => setTimeout(resolve, 300));
  return JSON.parse(JSON.stringify(categories.find(cat => cat.id === id)));
}

export async function addCategory(category: Omit<Category, 'id'>): Promise<Category> {
  console.log('[Data] addCategory: Attempting to add category:', category);
  // await new Promise(resolve => setTimeout(resolve, 300));
  const newCategory: Category = {
    ...category,
    id: String(Date.now() + Math.random()), // Simple unique ID generation
  };
  categories.push(newCategory);
  console.log('[Data] addCategory: Category added. New category object:', newCategory);
  console.log('[Data] addCategory: All categories after addition:', JSON.stringify(categories, null, 2));
  return JSON.parse(JSON.stringify(newCategory));
}

export async function updateCategory(id: string, updatedCategoryData: Partial<Omit<Category, 'id'>>): Promise<Category | undefined> {
  // await new Promise(resolve => setTimeout(resolve, 300));
  const categoryIndex = categories.findIndex(cat => cat.id === id);
  if (categoryIndex === -1) {
    return undefined;
  }
  categories[categoryIndex] = { ...categories[categoryIndex], ...updatedCategoryData };
  return JSON.parse(JSON.stringify(categories[categoryIndex]));
}

export async function deleteCategory(id: string): Promise<boolean> {
  // await new Promise(resolve => setTimeout(resolve, 300));
  const initialLength = categories.length;
  categories = categories.filter(cat => cat.id !== id);
  return categories.length < initialLength;
}

// Helper function to reset data for testing or demo purposes if needed
export function _resetCategories(newData?: Category[]): void {
  console.log('[Data] _resetCategories: Resetting categories.');
  categories = newData || [
    {
      id: '1',
      name: 'DevOps',
      logoUrl: 'https://placehold.co/64x64.png',
      contentLink: 'https://example.com/devops',
    },
    {
      id: '2',
      name: 'Kubernetes',
      logoUrl: 'https://placehold.co/64x64.png',
      contentLink: 'https://example.com/kubernetes',
    },
  ];
   console.log('[Data] _resetCategories: Categories after reset:', JSON.stringify(categories, null, 2));
}
