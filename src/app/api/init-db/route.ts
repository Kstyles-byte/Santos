import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAuthorized } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Verify admin token
    if (!(await isAuthorized(request))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Initializing SiteStatus table...');
    
    // First check if the table exists
    try {
      const tableExists = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'SiteStatus'
        );
      `;
      
      console.log('Table exists check result:', tableExists);
      
      // If the table doesn't exist, create it
      if (!tableExists || (Array.isArray(tableExists) && tableExists.length === 0) || 
          (Array.isArray(tableExists) && tableExists[0] && !tableExists[0].exists)) {
        console.log('Creating SiteStatus table...');
        
        // Create the table using raw SQL
        await prisma.$executeRaw`
          CREATE TABLE "SiteStatus" (
            "id" SERIAL PRIMARY KEY,
            "isLocked" BOOLEAN NOT NULL DEFAULT false,
            "message" TEXT NOT NULL DEFAULT 'The event draw has ended. Thank you for participating!',
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `;
        
        console.log('SiteStatus table created.');
      }
    } catch (error) {
      console.error('Error checking or creating table:', error);
    }
    
    // Now try to insert a record if none exists
    console.log('Checking for existing SiteStatus records...');
    const existingRecords = await prisma.$queryRaw`SELECT COUNT(*) FROM "SiteStatus"`;
    const count = Array.isArray(existingRecords) && existingRecords.length > 0 ? 
      parseInt(existingRecords[0].count) : 0;
    
    console.log('Found', count, 'records');
    
    if (count === 0) {
      console.log('Creating initial SiteStatus record...');
      
      // Create a default record
      await prisma.$executeRaw`
        INSERT INTO "SiteStatus" ("isLocked", "message", "updatedAt")
        VALUES (false, 'The event draw has ended. Thank you for participating!', CURRENT_TIMESTAMP)
      `;
      
      console.log('Initial record created.');
    }
    
    // Get the current status to return
    const status = await prisma.$queryRaw`SELECT * FROM "SiteStatus" LIMIT 1`;
    
    return NextResponse.json({
      success: true,
      message: 'SiteStatus table initialized',
      status: Array.isArray(status) && status.length > 0 ? status[0] : null
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database', details: String(error) },
      { status: 500 }
    );
  }
} 