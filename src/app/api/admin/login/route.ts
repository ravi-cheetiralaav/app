import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { adminLoginSchema } from '@/lib/validations';
import { createAdminSession } from '@/lib/auth/session';
import * as bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = adminLoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }
    
    const { username, password } = result.data;
    const db = await getDatabase();
    
    // Check if admin exists and is active
    const admin = await db.getAdminByUsername(username);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    if (!admin.isActive) {
      return NextResponse.json(
        { success: false, error: 'Admin account is inactive' },
        { status: 403 }
      );
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Create session
    await createAdminSession(username);
    
    return NextResponse.json({
      success: true,
      data: {
        username: admin.username,
      },
      message: 'Admin login successful'
    });
    
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}