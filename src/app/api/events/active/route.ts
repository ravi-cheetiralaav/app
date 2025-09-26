import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const activeEvent = await db.getActiveEvent();
    
    if (!activeEvent) {
      return NextResponse.json({
        success: false,
        error: 'No active event found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: activeEvent
    });
    
  } catch (error) {
    console.error('Get active event error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}