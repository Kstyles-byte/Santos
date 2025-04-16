import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAuthorized } from '@/lib/auth';

// POST /api/entries - Submit a new entry
export async function POST(request: Request) {
  try {
    const { fullName, phoneNumber, eventId } = await request.json();
    
    // Basic validation
    if (!fullName || !phoneNumber) {
      return NextResponse.json(
        { error: 'Full name and phone number are required' },
        { status: 400 }
      );
    }

    // Create entry in database
    const entry = await prisma.entry.create({
      data: {
        fullName,
        phoneNumber,
        eventId: eventId ? parseInt(eventId) : undefined,
      },
    });

    return NextResponse.json({ success: true, entry }, { status: 201 });
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    );
  }
}

// GET /api/entries - Get all entries (admin only)
export async function GET(request: Request) {
  try {
    // Verify admin token
    if (!(await isAuthorized(request))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const url = new URL(request.url);
    const eventId = url.searchParams.get('eventId');
    
    // Fetch entries with optional filtering
    const entries = await prisma.entry.findMany({
      where: eventId ? { eventId: parseInt(eventId) } : undefined,
      orderBy: { timestamp: 'desc' },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
} 