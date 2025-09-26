import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { placeOrderSchema } from '@/lib/validations';
import { requireUserAuth } from '@/lib/auth/session';
import { isOrderingOpen } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const userId = await requireUserAuth();
    
    const db = await getDatabase();
    const orders = await db.getOrdersByUser(userId);
    
    return NextResponse.json({
      success: true,
      data: orders
    });
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('authentication')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserAuth();
    
    const body = await request.json();
    
    // Validate input
    const result = placeOrderSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    
    // Check if event exists and ordering is still open
    const event = await db.getEventById(result.data.eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }
    
    if (!isOrderingOpen(event.cutoffDate)) {
      return NextResponse.json(
        { success: false, error: 'Ordering is closed for this event' },
        { status: 400 }
      );
    }
    
    const order = await db.createOrder(userId, result.data);
    
    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order placed successfully'
    });
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('authentication')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    
    if (error instanceof Error && error.message.includes('Insufficient stock')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    console.error('Place order error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}