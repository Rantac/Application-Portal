import { z } from 'zod';

export type Category = {
  id: string;
  name: string;
  logoUrl: string; // Can be a regular URL or a data URI
  contentLink: string;
};

export const CategorySchema = z.object({
  id: z.string().optional(), // Optional for creation, required for update
  name: z.string().min(3, { message: "Category name must be at least 3 characters." }),
  logoUrl: z.string().min(1, { message: "A logo image is required." }).describe("URL or data URI of the category logo."),
  contentLink: z.string().url({ message: "Please enter a valid URL for the content link." }),
});

export type CategoryFormData = z.infer<typeof CategorySchema>;

export const LoginSchema = z.object({
  username: z.string().trim().min(1, { message: "Username is required." }),
  password: z.string().trim().min(1, { message: "Password is required." }),
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
    contentLink?: string[];
    general?: string[];
  };
  success: boolean;
};
