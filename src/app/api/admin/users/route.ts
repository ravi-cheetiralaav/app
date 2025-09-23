import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { createUserSchema } from '@/lib/validations';
import { requireAdminAuth } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth();
    
    const db = await getDatabase();
    const users = await db.getAllUsers();
    
    return NextResponse.json({
      success: true,
      data: users
    });
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('authentication')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth();
    
    const body = await request.json();
    
    // Validate input
    const result = createUserSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    
    // Check if user already exists
    const userId = `${result.data.firstName}_${result.data.streetCode}_${result.data.houseNumber}`;
    const existingUser = await db.getUserById(userId);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this combination already exists' },
        { status: 409 }
      );
    }
    
    const user = await db.createUser(result.data);
    
    return NextResponse.json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('authentication')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    
    console.error('Create user error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}