import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAuthorized } from '@/lib/auth';

// GET /api/site-status - Get current site status
export async function GET() {
  try {
    // Get the current site status or create a default one if it doesn't exist
    let status = await prisma.siteStatus.findFirst();
    
    if (!status) {
      status = await prisma.siteStatus.create({
        data: {
          isLocked: false,
          message: "The event draw has ended. Thank you for participating!"
        }
      });
    }
    
    return NextResponse.json({ status });
  } catch (error) {
    console.error('Error fetching site status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site status' },
      { status: 500 }
    );
  }
}

// POST /api/site-status - Update site status (admin only)
export async function POST(request: Request) {
  try {
    // Verify admin token
    if (!(await isAuthorized(request))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { isLocked, message } = await request.json();

    // Update the site status or create a new one
    const status = await prisma.siteStatus.upsert({
      where: { id: 1 },
      update: {
        isLocked: isLocked !== undefined ? isLocked : undefined,
        message: message || undefined,
      },
      create: {
        isLocked: !!isLocked,
        message: message || "The event draw has ended. Thank you for participating!"
      }
    });

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('Error updating site status:', error);
    return NextResponse.json(
      { error: 'Failed to update site status' },
      { status: 500 }
    );
  }
} 