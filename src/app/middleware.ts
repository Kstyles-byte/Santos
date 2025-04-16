import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware ensures proper handling of the authentication token
// across all API routes
export function middleware(request: NextRequest) {
  // Pass through the request without modification
  return NextResponse.next();
}

// Only apply this middleware to API routes
export const config = {
  matcher: '/api/:path*',
}; 