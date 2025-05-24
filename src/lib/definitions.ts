import { z } from 'zod';

export type Category = {
  id: string;
  name: string;
  logoUrl: string;
  logoAiHint: string;
  contentCount: number;
  contentLink: string;
};

export const CategorySchema = z.object({
  id: z.string().optional(), // Optional for creation, required for update
  name: z.string().min(3, { message: "Category name must be at least 3 characters." }),
  logoUrl: z.string().url({ message: "Please enter a valid URL for the logo." }),
  logoAiHint: z.string().min(1, { message: "Logo AI hint is required."}).max(20, { message: "Logo AI hint too long."}),
  contentCount: z.coerce.number().int().min(0, { message: "Content count must be a non-negative number." }),
  contentLink: z.string().url({ message: "Please enter a valid URL for the content link." }),
});

export type CategoryFormData = z.infer<typeof CategorySchema>;

export const LoginSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export type LoginFormState = {
  message?: string;
  errors?: {
    username?: string[];
    password?: string[];
    general?: string[];
  };
  success: boolean;
};

export type CategoryFormState = {
  message?: string;
  errors?: {
    name?: string[];
    logoUrl?: string[];
    logoAiHint?: string[];
    contentCount?: string[];
    contentLink?: string[];
    general?: string[];
  };
  success: boolean;
};
