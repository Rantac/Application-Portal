
import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { ADMIN_USERNAME, ADMIN_PASSWORD_HASH, AUTH_COOKIE_NAME, SALT } from '@/lib/constants';

export function hashPassword(password: string): string {
  // In a real app, ensure SALT is complex and from env variables
  return createHash('sha256').update(password + SALT).digest('hex');
}

export async function verifyCredentials(username?: string, password?: string): Promise<boolean> {
  console.log('[Auth] Verifying credentials...');
  console.log('[Auth] Received username:', username);
  // Avoid logging the raw password directly in production, but for debugging:
  // console.log('[Auth] Received password (for hashing):', password);


  if (!username || !password) {
    console.log('[Auth] Username or password not provided.');
    return false;
  }

  const hashedPassword = hashPassword(password);
  console.log('[Auth] Hashed input password:', hashedPassword);
  console.log('[Auth] Stored ADMIN_USERNAME:', ADMIN_USERNAME);
  console.log('[Auth] Stored ADMIN_PASSWORD_HASH:', ADMIN_PASSWORD_HASH);

  const isUsernameMatch = username === ADMIN_USERNAME;
  const isPasswordMatch = hashedPassword === ADMIN_PASSWORD_HASH;

  console.log('[Auth] Username match:', isUsernameMatch);
  console.log('[Auth] Password (hash) match:', isPasswordMatch);

  if (isUsernameMatch && isPasswordMatch) {
    console.log('[Auth] Credentials verified successfully.');
    return true;
  } else {
    console.log('[Auth] Credentials verification failed.');
    return false;
  }
}

export async function setSessionCookie(): Promise<void> {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  cookies().set(AUTH_COOKIE_NAME, 'true', { expires, httpOnly: true, path: '/' });
  console.log('[Auth] Session cookie set.');
}

export async function clearSessionCookie(): Promise<void> {
  cookies().set(AUTH_COOKIE_NAME, '', { expires: new Date(0), httpOnly: true, path: '/' });
  console.log('[Auth] Session cookie cleared.');
}

export async function isAuthenticated(): Promise<boolean> {
  const session = cookies().get(AUTH_COOKIE_NAME);
  const authenticated = !!session && session.value === 'true';
  // console.log('[Auth] isAuthenticated check, session value:', session?.value, 'Result:', authenticated);
  return authenticated;
}

