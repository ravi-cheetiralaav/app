import { NextResponse } from 'next/server';
import dal from '@/lib/database/dal';

const data = new dal();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get('user_id');
    const event_id = url.searchParams.get('event_id');
    const conditions: any = {};
    if (user_id) conditions.user_id = user_id;
    if (event_id) conditions.event_id = event_id;
    const orders = await data.getOrders(conditions);
    return NextResponse.json(orders);
  } catch (err: any) {
    return new NextResponse(err.message || String(err), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // expected: { user_id, event_id, items: [{ menu_item_id, quantity }], notes? }
    if (!body || !Array.isArray(body.items) || body.items.length === 0) {
      return new NextResponse('Invalid payload: items required', { status: 400 });
    }
    if (!body.user_id) return new NextResponse('Missing user_id', { status: 400 });
    const order_id = `ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const result = await data.executeTransaction(async () => {
      let total = 0;
      // compute prices and ensure availability
      const lines: any[] = [];
      for (const it of body.items) {
        const menu = await (data as any).getMenuItemById ? await (data as any).getMenuItemById(it.menu_item_id) : null;
        if (!menu) throw new Error(`Menu item not found: ${it.menu_item_id}`);
        if (menu.quantity_available < it.quantity) throw new Error(`Not enough stock for ${menu.name}`);
        const unit = Number(menu.price) || 0;
        const subtotal = unit * Number(it.quantity);
        total += subtotal;
        lines.push({ menu, quantity: Number(it.quantity), unit, subtotal });
      }

      // create order
      await data.createOrder({
        order_id,
        user_id: body.user_id,
        event_id: body.event_id || (lines[0]?.menu?.event_id || ''),
        status: 'pending',
        total_amount: total,
        notes: body.notes || ''
      });

      // add order items and update stock
      for (const ln of lines) {
        await data.addOrderItem({ order_id, menu_item_id: ln.menu.id, quantity: ln.quantity, unit_price: ln.unit, subtotal: ln.subtotal });
        const newQty = Math.max(0, (ln.menu.quantity_available || 0) - ln.quantity);
        await data.updateMenuItemStock(ln.menu.id, newQty);
      }

      return { order_id };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return new NextResponse(err.message || String(err), { status: 500 });
  }
}
