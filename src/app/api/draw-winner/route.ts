import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAuthorized } from '@/lib/auth';

// POST /api/draw-winner - Select a random winner
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
    
    // Randomly select a winner using SQL RANDOM() function
    // Exclude entries that are already winners
    const winner = await prisma.$queryRaw`
      SELECT * FROM "Entry"
      WHERE "isWinner" = false
      ${eventId ? prisma.$raw`AND "eventId" = ${parseInt(eventId)}` : prisma.$raw``}
      ORDER BY RANDOM()
      LIMIT 1
    `;

    if (!winner || !Array.isArray(winner) || winner.length === 0) {
      return NextResponse.json(
        { error: 'No eligible entries found' },
        { status: 404 }
      );
    }

    // Update the winner status in the database
    await prisma.entry.update({
      where: { id: winner[0].id },
      data: {
        isWinner: true,
        drawTimestamp: new Date(),
      },
    });

    return NextResponse.json({ winner: winner[0] });
  } catch (error) {
    console.error('Error drawing winner:', error);
    return NextResponse.json(
      { error: 'Failed to draw winner' },
      { status: 500 }
    );
  }
} 