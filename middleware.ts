import { NextRequest, NextResponse } from 'next/server'

const HOSTNAMES = {
  main: 'www.indorigaadiwala.com',
  alternatives: [
    'indorigaadiwala.com',
    'gaadiwala-nextjs.vercel.app',
    'indorigaadiwala.vercel.app',
    'localhost:3000'
  ]
}

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  
  // If accessing from alternative domain, redirect to main domain
  if (HOSTNAMES.alternatives.includes(hostname) && hostname !== HOSTNAMES.main) {
    const url = request.nextUrl.clone()
    url.hostname = HOSTNAMES.main
    url.protocol = 'https'
    return NextResponse.redirect(url, 301)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico).*)',
  ],
}
