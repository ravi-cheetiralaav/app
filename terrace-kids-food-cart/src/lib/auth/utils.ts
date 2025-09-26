import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth/nextauth';
import { User } from '@/lib/types';

export interface ExtendedSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  user_id: string;
  greeting_word: string;
  is_admin: boolean;
  expires: string;
}

export async function getAuthSession(): Promise<ExtendedSession | null> {
  const session = await getServerSession(authOptions);
  return session as ExtendedSession | null;
}

export async function requireAuth(): Promise<ExtendedSession> {
  const session = await getAuthSession();
  if (!session) {
    throw new Error('Authentication required');
  }
  return session;
}

export async function requireAdminAuth(): Promise<ExtendedSession> {
  const session = await requireAuth();
  if (!session.is_admin) {
    throw new Error('Admin access required');
  }
  return session;
}

export function generateUserId(firstName: string, streetCode: string, houseNumber: string): string {
  // Format: FirstName_StreetCode_HouseNo
  const cleanFirstName = firstName.trim().replace(/\s+/g, '');
  const cleanStreetCode = streetCode.trim().toUpperCase();
  const cleanHouseNumber = houseNumber.trim();
  
  return `${cleanFirstName}_${cleanStreetCode}_${cleanHouseNumber}`;
}

export function parseUserId(userId: string): { firstName: string; streetCode: string; houseNumber: string } | null {
  const parts = userId.split('_');
  if (parts.length !== 3) {
    return null;
  }
  
  return {
    firstName: parts[0],
    streetCode: parts[1],
    houseNumber: parts[2],
  };
}

export function isUserIdValid(userId: string): boolean {
  const parsed = parseUserId(userId);
  return parsed !== null && 
         parsed.firstName.length > 0 && 
         parsed.streetCode.length > 0 && 
         parsed.houseNumber.length > 0;
}

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = require('bcryptjs');
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(password, hash);
}