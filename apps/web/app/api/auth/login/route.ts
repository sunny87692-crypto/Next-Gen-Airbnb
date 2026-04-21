import { NextResponse } from 'next/server';

function buildDemoToken(email: string) {
  const name = email.split('@')[0] || 'NWXT User';
  const payload = {
    id: `demo-${email.toLowerCase()}`,
    name,
    email: email.toLowerCase(),
  };

  return `demo.${Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')}`;
}

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body.email === 'string' ? body.email : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
  }

  return NextResponse.json({
    message: 'Login successful using the local Sprint 1 stub.',
    token: buildDemoToken(email),
  });
}
