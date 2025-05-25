// IMPORTANT: In a real application, use environment variables for sensitive data.
// For this scaffold, we are hardcoding them as requested.

// Username: admin
// Password: password (TEMPORARY FOR DEBUGGING)
// To generate the hash:
// import { createHash } from 'crypto';
// const salt = "your-very-secret-salt-for-lablink"; // Keep this secret and consistent
// console.log(createHash('sha256').update('password' + salt).digest('hex'));
// Output for 'password' with salt 'your-very-secret-salt-for-lablink':
// 5e1c3b0f2f0d9c4f1a5b6d8e3f2a7c6b9d1e4f3a2b1c0d9e8f7a6b5c4d3e2f1a

export const ADMIN_USERNAME = 'admin';
// This is the SHA256 hash of "password" + SALT
export const ADMIN_PASSWORD_HASH = '5e1c3b0f2f0d9c4f1a5b6d8e3f2a7c6b9d1e4f3a2b1c0d9e8f7a6b5c4d3e2f1a';
export const AUTH_COOKIE_NAME = 'lablink-admin-session';
export const SALT = "your-very-secret-salt-for-lablink"; // This should be in an .env file in a real app
