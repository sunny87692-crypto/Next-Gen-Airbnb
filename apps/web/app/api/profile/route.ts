import { NextResponse } from 'next/server';

type DemoUser = {
  id: string;
  name: string;
  email: string;
};

function decodeToken(token: string): DemoUser | null {
  if (!token.startsWith('demo.')) {
    return null;
  }

  try {
    const payload = token.slice(5);
    const user = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as DemoUser;
    if (!user.id || !user.name || !user.email) {
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ message: 'Missing auth token' }, { status: 401 });
  }

  const user = decodeToken(token);
  if (!user) {
    return NextResponse.json({ message: 'Invalid auth token' }, { status: 401 });
  }

  return NextResponse.json({
    ...user,
    message: 'Profile fetched successfully from the local Sprint 1 stub.',
  });
}
