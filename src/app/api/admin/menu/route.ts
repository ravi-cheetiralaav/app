import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { createMenuItemSchema } from '@/lib/validations';
import { requireAdminAuth } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth();
    
    const db = await getDatabase();
    const menuItems = await db.getAllMenuItems();
    
    return NextResponse.json({
      success: true,
      data: menuItems
    });
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('authentication')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    
    console.error('Get menu items error:', error);
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
    const result = createMenuItemSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    const menuItem = await db.createMenuItem(result.data);
    
    return NextResponse.json({
      success: true,
      data: menuItem,
      message: 'Menu item created successfully'
    });
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('authentication')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    
    console.error('Create menu item error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}