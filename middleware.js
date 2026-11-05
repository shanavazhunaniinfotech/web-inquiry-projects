export const config = {
  matcher: ['/', '/index', '/index.html'],
};

export default function middleware(request) {
  const expected = process.env.HOME_PASSWORD;
  const header = request.headers.get('authorization') || '';

  if (expected && header.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6));
      const password = decoded.slice(decoded.indexOf(':') + 1);
      if (password === expected) return;
    } catch {}
  }

  return new Response('Password required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Client Sites", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  });
}
