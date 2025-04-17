import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    console.log('Checking database tables...');
    
    // Check what tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('Database tables:', tables);
    
    // Check if SiteStatus table exists
    const siteStatusTable = await prisma.$queryRaw`
      SELECT * 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'SiteStatus'
    `;
    
    // Check if there's any data in the SiteStatus table (if it exists)
    let siteStatusData = null;
    if (Array.isArray(siteStatusTable) && siteStatusTable.length > 0) {
      siteStatusData = await prisma.$queryRaw`
        SELECT * FROM "SiteStatus" LIMIT 1
      `;
    }
    
    return NextResponse.json({
      tables,
      siteStatusExists: Array.isArray(siteStatusTable) && siteStatusTable.length > 0,
      siteStatusData,
    });
  } catch (error) {
    console.error('Error checking database:', error);
    return NextResponse.json(
      { error: 'Failed to check database', details: String(error) },
      { status: 500 }
    );
  }
} 