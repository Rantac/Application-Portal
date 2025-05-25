// IMPORTANT: In a real application, use environment variables for sensitive data.
// For this scaffold, we are hardcoding them as requested.

// Username: admin
// Password: password123
// To generate the hash:
// import { createHash } from 'crypto';
// const salt = "your-very-secret-salt-for-lablink"; // Keep this secret and consistent
// console.log(createHash('sha256').update('password123' + salt).digest('hex'));
// Output for 'password123' with salt 'your-very-secret-salt-for-lablink':
// b7a8e478210710a70d5a09063400981191e2b5c25323ac576913c880629e716a

export const ADMIN_USERNAME = 'admin';
// This is the SHA256 hash of "password123" + SALT
export const ADMIN_PASSWORD_HASH = 'b7a8e478210710a70d5a09063400981191e2b5c25323ac576913c880629e716a';
export const AUTH_COOKIE_NAME = 'lablink-admin-session';
export const SALT = "your-very-secret-salt-for-lablink"; // This should be in an .env file in a real app

