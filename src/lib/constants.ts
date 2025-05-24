// IMPORTANT: In a real application, use environment variables for sensitive data.
// For this scaffold, we are hardcoding them as requested.

// Username: admin
// Password: password123
// To generate the hash:
// import { createHash } from 'crypto';
// const salt = "your-very-secret-salt-for-lablink"; // Keep this secret and consistent
// console.log(createHash('sha256').update('password123' + salt).digest('hex'));
// Output for 'password123' with salt 'your-very-secret-salt-for-lablink':
// 5f4f6a35872c1e9a5e2d5f9d7f8a7b1c3e0d9a8b7c6e5f4d3c2b1a0a9f8e7d6c (example hash)
// For this exercise, let's use a simpler pre-hashed password without an explicit salt in code for easier review,
// but acknowledge that a proper salt stored securely (e.g., env var) is best practice.
// Hash for "password123" (simple SHA256 without explicit salt for demo purposes):
// ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f

export const ADMIN_USERNAME = 'admin';
// This is the SHA256 hash of "password123"
export const ADMIN_PASSWORD_HASH = 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f';
export const AUTH_COOKIE_NAME = 'lablink-admin-session';
export const SALT = "your-very-secret-salt-for-lablink"; // This should be in an .env file in a real app
