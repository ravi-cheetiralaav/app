import { NextResponse } from 'next/server';
import dal from '@/lib/database/dal';

const data = new dal();

export async function GET(req: Request) {
  try {
    const events = await data.getEvents();
    return NextResponse.json(events);
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // expect: { event_id, name, event_date, cutoff_date, is_active }
    const res = await data.createEvent(body);
    return NextResponse.json(res);
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const event_id = url.searchParams.get('event_id');
    if (!event_id) return new NextResponse('Missing event_id', { status: 400 });
    const body = await req.json();
    const res = await data.updateEvent ? await (data as any).updateEvent(event_id, body) : { changes: 0, success: false };
    return NextResponse.json(res);
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}
