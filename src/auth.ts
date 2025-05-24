import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { ADMIN_USERNAME, ADMIN_PASSWORD_HASH, AUTH_COOKIE_NAME, SALT } from '@/lib/constants';

export function hashPassword(password: string): string {
  // In a real app, ensure SALT is complex and from env variables
  return createHash('sha256').update(password + SALT).digest('hex');
}

export async function verifyCredentials(username?: string, password?: string): Promise<boolean> {
  if (!username || !password) {
    return false;
  }
  const hashedPassword = hashPassword(password);
  return username === ADMIN_USERNAME && hashedPassword === ADMIN_PASSWORD_HASH;
}

export async function setSessionCookie(): Promise<void> {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  cookies().set(AUTH_COOKIE_NAME, 'true', { expires, httpOnly: true, path: '/' });
}

export async function clearSessionCookie(): Promise<void> {
  cookies().set(AUTH_COOKIE_NAME, '', { expires: new Date(0), httpOnly: true, path: '/' });
}

export async function isAuthenticated(): Promise<boolean> {
  const session = cookies().get(AUTH_COOKIE_NAME);
  return !!session && session.value === 'true';
}
