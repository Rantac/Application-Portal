// IMPORTANT: In a real application, use environment variables for sensitive data.
// For this scaffold, we are hardcoding them as requested.

// Username: admin
// Password: testpassword (TEMPORARY FOR DEBUGGING)
// To generate the hash:
// import { createHash } from 'crypto';
// const salt = "your-very-secret-salt-for-lablink"; // Keep this secret and consistent
// console.log(createHash('sha256').update('testpassword' + salt).digest('hex'));
// Output for 'testpassword' with salt 'your-very-secret-salt-for-lablink':
// c1db53977f989cbe72a5b82f9dd9689a349e528350f893f919a61d83c97a6de7

export const ADMIN_USERNAME = 'admin';
// This is the SHA256 hash of "testpassword" + SALT
export const ADMIN_PASSWORD_HASH = 'c1db53977f989cbe72a5b82f9dd9689a349e528350f893f919a61d83c97a6de7';
export const AUTH_COOKIE_NAME = 'lablink-admin-session';
export const SALT = "your-very-secret-salt-for-lablink"; // This should be in an .env file in a real app
