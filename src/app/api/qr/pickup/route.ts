import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { qrCodeSchema } from '@/lib/validations';
import { requireAdminAuth } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth();
    
    const body = await request.json();
    
    // Validate input
    const result = qrCodeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }
    
    const { qrCode } = result.data;
    const db = await getDatabase();
    
    // Validate QR code and get order
    const order = await db.validateQRCode(qrCode);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Invalid QR code' },
        { status: 404 }
      );
    }
    
    if (order.status === 'picked-up') {
      return NextResponse.json(
        { success: false, error: 'Order already picked up' },
        { status: 400 }
      );
    }
    
    // Mark order as picked up
    const updatedOrder = await db.updateOrderStatus(order.id, 'picked-up');
    
    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order marked as picked up successfully'
    });
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('authentication')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    
    console.error('QR pickup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}