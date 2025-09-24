import { NextResponse } from 'next/server';
import dal from '@/lib/database/dal';
import { requireAdminAuth } from '@/lib/auth/utils';

const data = new dal();

export async function GET(req: Request) {
  try {
    // Ensure the request is from an authenticated admin session
    await requireAdminAuth();
    const url = new URL(req.url);
    const event_id = url.searchParams.get('event_id') || undefined;
    const orders = await data.getOrdersWithItems(undefined, event_id);
    return NextResponse.json(orders);
  } catch (err: any) {
    if (String(err).toLowerCase().includes('authentication')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    return new NextResponse(err.message || 'Internal Server Error', { status: 500 });
  }
}

// PATCH to approve orders. Accepts body: { order_ids: string[] , action: 'approve'|'reject' }
export async function PATCH(req: Request) {
  try {
    // Ensure the request is from an authenticated admin session
    await requireAdminAuth();
    const body = await req.json();
    const order_ids: string[] = Array.isArray(body.order_ids) ? body.order_ids : (body.order_id ? [body.order_id] : []);
    const action = body.action || 'approve';
    if (!order_ids || order_ids.length === 0) return new NextResponse('No order_ids provided', { status: 400 });

    const results: Array<{ order_id: string; success: boolean; message?: string }> = [];

    for (const oid of order_ids) {
      try {
        if (action === 'approve') {
          await data.updateOrder(oid, { status: 'approved' as any });
        } else if (action === 'reject') {
          await data.updateOrder(oid, { status: 'rejected' as any });
        } else {
          throw new Error('Unknown action');
        }
        results.push({ order_id: oid, success: true });
      } catch (e: any) {
        results.push({ order_id: oid, success: false, message: e?.message || String(e) });
      }
    }

    return NextResponse.json({ results });
  } catch (err: any) {
    if (String(err).toLowerCase().includes('authentication')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    return new NextResponse(err.message || 'Internal Server Error', { status: 500 });
  }
}

// DELETE to remove orders. Accepts body: { order_ids: string[] } or query ?order_id=
export async function DELETE(req: Request) {
  try {
    const session = await requireAdminAuth();

    const url = new URL(req.url);
    const qOrderId = url.searchParams.get('order_id');

    let body: any = {};
    try { body = await req.json(); } catch (e) { /* ignore if no JSON */ }

    const order_ids: string[] = Array.isArray(body?.order_ids)
      ? body.order_ids
      : (body?.order_id ? [body.order_id] : (qOrderId ? [qOrderId] : []));

    const confirm = body?.confirm === true || body?.confirm === 'true';
    const reason = typeof body?.reason === 'string' ? body.reason.trim() : '';

    if (!order_ids || order_ids.length === 0) return new NextResponse('No order_ids provided', { status: 400 });
    if (!confirm) return new NextResponse('Delete not confirmed. Set confirm=true in request body.', { status: 400 });
    if (!reason) return new NextResponse('A reason for deletion is required.', { status: 400 });

    const adminId = (session as any)?.user_id || (session as any)?.user?.id || 'unknown';

    const results: Array<{ order_id: string; success: boolean; message?: string }> = [];

    for (const oid of order_ids) {
      try {
        // perform soft-delete and insert audit record atomically inside DAL
        await data.deleteOrder(oid, adminId, reason);

        results.push({ order_id: oid, success: true });
      } catch (e: any) {
        results.push({ order_id: oid, success: false, message: e?.message || String(e) });
      }
    }

    return NextResponse.json({ results });
  } catch (err: any) {
    if (String(err).toLowerCase().includes('authentication')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    return new NextResponse(err.message || 'Internal Server Error', { status: 500 });
  }
}
