import { NextResponse } from 'next/server';
import { stringify } from 'csv-stringify/sync';
import { prisma } from '@/lib/db';
import { isAuthorized } from '@/lib/auth';

// GET /api/export - Export entries as CSV or JSON
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
    const format = url.searchParams.get('format') || 'json';
    
    // Fetch entries with optional filtering
    const entries = await prisma.entry.findMany({
      where: eventId ? { eventId: parseInt(eventId) } : undefined,
      orderBy: { timestamp: 'desc' },
      include: {
        event: {
          select: {
            name: true,
            date: true,
            location: true
          }
        }
      }
    });

    // Format for export (CSV or JSON)
    if (format === 'csv') {
      // Prepare data for CSV
      const csvData = entries.map(entry => ({
        ID: entry.id,
        Name: entry.fullName,
        PhoneNumber: entry.phoneNumber,
        Timestamp: entry.timestamp,
        Event: entry.event?.name || 'None',
        IsWinner: entry.isWinner ? 'Yes' : 'No',
        DrawTime: entry.drawTimestamp || ''
      }));
      
      // Generate CSV
      const csv = stringify(csvData, {
        header: true,
        columns: ['ID', 'Name', 'PhoneNumber', 'Timestamp', 'Event', 'IsWinner', 'DrawTime']
      });
      
      // Return as downloadable file
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=santos_entries.csv'
        }
      });
    }
    
    // Default: return as JSON
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error exporting entries:', error);
    return NextResponse.json(
      { error: 'Failed to export entries' },
      { status: 500 }
    );
  }
} 