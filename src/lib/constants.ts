// IMPORTANT: In a real application, use environment variables for sensitive data.
// For this scaffold, we are hardcoding them as requested.

// Username: admin
// Password: @Black123456
// To generate the hash:
// import { createHash } from 'crypto';
// const salt = "your-very-secret-salt-for-lablink"; // Keep this secret and consistent
// console.log(createHash('sha256').update('@Black123456' + salt).digest('hex'));
// Output for '@Black123456' with salt 'your-very-secret-salt-for-lablink':
// 4610b692b99709968786862314b381342d89e69789116f5d7253050e4a7a566a

export const ADMIN_USERNAME = 'admin';
// This is the SHA256 hash of "@Black123456" + SALT
export const ADMIN_PASSWORD_HASH = '4610b692b99709968786862314b381342d89e69789116f5d7253050e4a7a566a';
export const AUTH_COOKIE_NAME = 'lablink-admin-session';
export const SALT = "your-very-secret-salt-for-lablink"; // This should be in an .env file in a real app

