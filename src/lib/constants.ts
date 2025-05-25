// IMPORTANT: In a real application, use environment variables for sensitive data.
// For this scaffold, we are hardcoding them as requested.

// Username: admin
// Password: password
// To generate the hash:
// import { createHash } from 'crypto';
// const salt = "your-very-secret-salt-for-lablink"; // Keep this secret and consistent
// console.log(createHash('sha256').update('password' + salt).digest('hex'));
// Output for 'password' + 'your-very-secret-salt-for-lablink':
// 0feaf922e28272e2553f5c76be760192f863cab7ea7a5edec039ede88ea1df00

export const ADMIN_USERNAME = 'admin';
// This is the SHA256 hash of "password" + SALT
export const ADMIN_PASSWORD_HASH = '0feaf922e28272e2553f5c76be760192f863cab7ea7a5edec039ede88ea1df00';
export const AUTH_COOKIE_NAME = 'lablink-admin-session';
export const SALT = "your-very-secret-salt-for-lablink"; // This should be in an .env file in a real app
