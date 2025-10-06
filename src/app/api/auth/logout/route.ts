import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    await destroySession();
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}