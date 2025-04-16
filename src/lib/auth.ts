import { NextApiRequest } from 'next';
import { NextRequest } from 'next/server';
import { prisma } from './db';

export const ADMIN_TOKEN_HEADER = 'x-admin-token';

export async function verifyAdminToken(request: NextRequest | NextApiRequest): Promise<boolean> {
  // Extract token from headers
  const token = request instanceof NextRequest 
    ? request.headers.get(ADMIN_TOKEN_HEADER)
    : request.headers[ADMIN_TOKEN_HEADER] as string;

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
export async function isAuthorized(request: NextRequest | NextApiRequest): Promise<boolean> {
  return verifyAdminToken(request);
} 