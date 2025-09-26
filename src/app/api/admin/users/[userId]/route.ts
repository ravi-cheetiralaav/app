import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { requireAdminAuth } from '@/lib/auth/session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await requireAdminAuth();
    
    const { userId } = await params;
    const db = await getDatabase();
    
    const user = await db.getUserById(decodeURIComponent(userId));
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user
    });
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('authentication')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await requireAdminAuth();
    
    const { userId } = await params;
    const body = await request.json();
    const db = await getDatabase();
    
    const user = await db.getUserById(decodeURIComponent(userId));
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const updatedUser = await db.updateUser(decodeURIComponent(userId), body);
    
    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('authentication')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await requireAdminAuth();
    
    const { userId } = await params;
    const db = await getDatabase();
    
    const success = await db.deleteUser(decodeURIComponent(userId));
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('authentication')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    
    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}