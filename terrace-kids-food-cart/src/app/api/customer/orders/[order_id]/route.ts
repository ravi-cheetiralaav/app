import { NextResponse } from 'next/server';
import dal from '@/lib/database/dal';

const data = new dal();

export async function PATCH(req: Request, context: any) {
  try {
    const order_id = context?.params?.order_id;
    const body = await req.json();
    // expected body: { user_id, items: [{ menu_item_id, quantity }] }
    if (!body || !Array.isArray(body.items)) return new NextResponse('Invalid payload', { status: 400 });
    if (!body.user_id) return new NextResponse('Missing user_id', { status: 400 });

    // Load existing order
    const existing = await data.getOrderWithItems(order_id);
    if (!existing) return new NextResponse('Order not found', { status: 404 });

    // Verify ownership
    if (existing.user_id !== body.user_id) return new NextResponse('Not authorized', { status: 403 });

    // Only allow edits on orders that are pending or scheduled (not completed or past)
    if (existing.status && !['pending', 'scheduled', 'draft'].includes(existing.status)) {
      return new NextResponse('Order cannot be edited in its current state', { status: 400 });
    }

    // Strict: disallow edits to already approved orders (view-only)
    if ((existing.status as any) === 'approved') {
      return new NextResponse('Approved orders are read-only', { status: 409 });
    }

    // Delegate to DAL update (to be implemented)
    const updated = await data.updateOrderItems(order_id, body.items);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return new NextResponse(err.message || String(err), { status: 500 });
  }
}

export async function GET(req: Request, context: any) {
  try {
    const order_id = context?.params?.order_id;
    const order = await data.getOrderWithItems(order_id);
    if (!order) return new NextResponse('Order not found', { status: 404 });
    return NextResponse.json(order);
  } catch (err: any) {
    return new NextResponse(err.message || String(err), { status: 500 });
  }
}
