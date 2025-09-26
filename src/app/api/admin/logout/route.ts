import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    await destroySession();
    
    return NextResponse.json({
      success: true,
      message: 'Admin logged out successfully'
    });
    
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}