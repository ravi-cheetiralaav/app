import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const menuItems = await db.getActiveMenuItems();
    
    return NextResponse.json({
      success: true,
      data: menuItems
    });
    
  } catch (error) {
    console.error('Get menu items error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}