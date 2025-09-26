import { NextResponse } from 'next/server';
import dal from '@/lib/database/dal';

const data = new dal();

export async function GET(req: Request) {
  try {
    // Return items enriched with sales data (quantity_sold)
    const url = new URL(req.url);
    const event_id = url.searchParams.get('event_id') || undefined;
    const items = await data.getMenuItemsWithSales(event_id);
    return NextResponse.json(items);
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Ensure menu item is associated with an active event (event_id is NOT NULL in schema)
    const activeEvent = await data.getActiveEvent();
    if (!activeEvent) {
      return new NextResponse('No active event found. Create an event before adding menu items.', { status: 400 });
    }
    const payload = {
      ...body,
      event_id: body.event_id || activeEvent.event_id,
      ingredients: Array.isArray(body.ingredients) ? body.ingredients : (body.ingredients ? String(body.ingredients).split(',').map((s: string) => s.trim()).filter(Boolean) : []),
      health_benefits: Array.isArray(body.health_benefits) ? body.health_benefits : (body.health_benefits ? String(body.health_benefits).split(',').map((s: string) => s.trim()).filter(Boolean) : []),
      qty_per_unit: body.qty_per_unit,
      calories: typeof body.calories !== 'undefined' ? Number(body.calories) : null
    };
    const res = await data.createMenuItem(payload);
    return NextResponse.json(res);
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const idParam = url.searchParams.get('id');
    if (!idParam) return new NextResponse('Missing id', { status: 400 });
    const id = Number(idParam);
    const body = await req.json();
    const updates = {
      ...body,
      ingredients: Array.isArray(body.ingredients) ? body.ingredients : (body.ingredients ? String(body.ingredients).split(',').map((s: string) => s.trim()).filter(Boolean) : undefined),
      health_benefits: Array.isArray(body.health_benefits) ? body.health_benefits : (body.health_benefits ? String(body.health_benefits).split(',').map((s: string) => s.trim()).filter(Boolean) : undefined),
      qty_per_unit: body.qty_per_unit,
      calories: typeof body.calories !== 'undefined' ? Number(body.calories) : undefined
    };
    const res = await data.updateMenuItem(id, updates);
    return NextResponse.json(res);
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const idParam = url.searchParams.get('id');
    if (!idParam) return new NextResponse('Missing id', { status: 400 });
    const id = Number(idParam);
    const res = await data.deleteMenuItem(id);
    if (!res.success) return new NextResponse(res.message || 'Failed to delete', { status: 400 });
    return NextResponse.json(res);
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}
