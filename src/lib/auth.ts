import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './db';

export const ADMIN_TOKEN_HEADER = 'x-admin-token';

// This function can handle all three types of request objects
export async function verifyAdminToken(request: Request | NextRequest | NextApiRequest): Promise<boolean> {
  // Extract token from headers
  let token: string | null | undefined;
  
  if (request instanceof Request || request instanceof NextRequest) {
    // Standard Request or NextRequest (App Router)
    token = request.headers.get(ADMIN_TOKEN_HEADER);
  } else {
    // NextApiRequest (Pages Router)
    token = request.headers[ADMIN_TOKEN_HEADER] as string;
  }

  if (!token) {
    return false;
  }

  // Verify token against the database
  try {
    const admin = await prisma.admin.findFirst({
      where: { token },
    });

    return !!admin;
  } catch (error) {
    console.error('Error verifying admin token:', error);
    return false;
  }
}

// For admin route handlers
export async function isAuthorized(request: Request | NextRequest | NextApiRequest): Promise<boolean> {
  return verifyAdminToken(request);
} 