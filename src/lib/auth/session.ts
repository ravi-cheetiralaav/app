import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';
const key = new TextEncoder().encode(secretKey);

export interface SessionData {
  userId?: string;
  isAdmin?: boolean;
  username?: string;
  [key: string]: any;
}

export async function encrypt(payload: SessionData): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionData> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload as SessionData;
}

export async function createUserSession(userId: string): Promise<void> {
  const session = await encrypt({ userId, isAdmin: false });
  const cookieStore = await cookies();
  
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  });
}

export async function createAdminSession(username: string): Promise<void> {
  const session = await encrypt({ username, isAdmin: true });
  const cookieStore = await cookies();
  
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  
  if (!session) return null;
  
  try {
    return await decrypt(session);
  } catch (error) {
    console.error('Error decrypting session:', error);
    return null;
  }
}

export async function getSessionFromRequest(request: NextRequest): Promise<SessionData | null> {
  const session = request.cookies.get('session')?.value;
  
  if (!session) return null;
  
  try {
    return await decrypt(session);
  } catch (error) {
    console.error('Error decrypting session:', error);
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();
  if (!session || (!session.userId && !session.isAdmin)) {
    throw new Error('Authentication required');
  }
  return session;
}

export async function requireAdminAuth(): Promise<SessionData> {
  const session = await getSession();
  if (!session || !session.isAdmin) {
    throw new Error('Admin authentication required');
  }
  return session;
}

export async function requireUserAuth(): Promise<string> {
  const session = await getSession();
  if (!session || !session.userId || session.isAdmin) {
    throw new Error('User authentication required');
  }
  return session.userId;
}