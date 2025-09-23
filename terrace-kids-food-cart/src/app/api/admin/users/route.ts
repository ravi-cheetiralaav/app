import { NextResponse } from 'next/server';
import dal from '@/lib/database/dal';

const data = new dal();

export async function GET(req: Request) {
  try {
    const users = await data.getUsers();
    return NextResponse.json(users);
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Build user_id from first name, street_code and house_number if not provided
    const user_id = body.user_id || `${body.first_name}_${body.street_code}_${body.house_number}`;
    const payload = { ...body, user_id };
    const res = await data.createUser(payload);
    return NextResponse.json(res);
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get('user_id');
    if (!user_id) return new NextResponse('Missing user_id', { status: 400 });
    const body = await req.json();
    const res = await data.updateUser(user_id, body);
    return NextResponse.json(res);
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}
