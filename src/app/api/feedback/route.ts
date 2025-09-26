import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { createFeedbackSchema } from '@/lib/validations';
import { requireUserAuth } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserAuth();
    
    const body = await request.json();
    
    // Validate input
    const result = createFeedbackSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    const feedback = await db.createFeedback(userId, result.data);
    
    return NextResponse.json({
      success: true,
      data: feedback,
      message: 'Feedback submitted successfully'
    });
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('authentication')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    
    console.error('Create feedback error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}