import { NextResponse } from 'next/server';

function buildDemoToken(name: string, email: string) {
  const payload = {
    id: `demo-${email.toLowerCase()}`,
    name,
    email: email.toLowerCase(),
  };

  return `demo.${Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')}`;
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = typeof body.name === 'string' ? body.name : '';
  const email = typeof body.email === 'string' ? body.email : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!name || !email || !password) {
    return NextResponse.json({ message: 'Name, email, and password are required.' }, { status: 400 });
  }

  return NextResponse.json({
    message: 'Registration successful using the local Sprint 1 stub.',
    token: buildDemoToken(name, email),
  });
}
