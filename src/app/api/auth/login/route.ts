import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { loginSchema } from '@/lib/validations';
import { createUserSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }
    
    const { userId } = result.data;
    const db = await getDatabase();
    
    // Check if user exists and is active
    const user = await db.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'User account is inactive' },
        { status: 403 }
      );
    }
    
    // Create session
    await createUserSession(userId);
    
    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        firstName: user.firstName,
        greetingWord: user.greetingWord,
      },
      message: `${user.greetingWord} ${user.firstName}! Welcome back.`
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}