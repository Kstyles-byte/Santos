import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as crypto from 'crypto';

// Basic password hashing function
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// POST /api/admin/login - Admin login
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find admin by username
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin || admin.passwordHash !== hashPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return admin token and info (excluding password hash)
    const { passwordHash, ...adminInfo } = admin;
    
    return NextResponse.json({
      success: true,
      admin: adminInfo,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 