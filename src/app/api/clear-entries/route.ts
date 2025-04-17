import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAuthorized } from '@/lib/auth';

// POST /api/clear-entries - Clear all entries (admin only)
export async function POST(request: Request) {
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
    const clearWinners = url.searchParams.get('clearWinners') === 'true';
    
    // Build the where clause based on parameters
    let whereClause = {};
    
    if (eventId) {
      whereClause = { eventId: parseInt(eventId) };
    }
    
    // If clearWinners is false, only clear non-winners
    if (!clearWinners) {
      whereClause = { 
        ...whereClause,
        isWinner: false 
      };
    }
    
    // Delete entries based on the where clause
    const result = await prisma.entry.deleteMany({
      where: whereClause
    });

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.count,
      message: `Successfully deleted ${result.count} entries.`
    });
  } catch (error) {
    console.error('Error clearing entries:', error);
    return NextResponse.json(
      { error: 'Failed to clear entries' },
      { status: 500 }
    );
  }
} 