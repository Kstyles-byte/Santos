import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAuthorized } from '@/lib/auth';

// GET /api/site-status - Get current site status
export async function GET() {
  try {
    console.log('Fetching site status...');
    
    // Check if the model is available in prisma client
    const modelNames = Object.keys(prisma);
    console.log('Available Prisma models:', modelNames);
    
    // Get the current site status or create a default one if it doesn't exist
    let status;
    
    try {
      // @ts-ignore - TypeScript might not recognize the model yet
      status = await prisma.siteStatus.findFirst();
      console.log('Fetched status:', status);
    } catch (err) {
      console.error('Error in findFirst:', err);
      
      // Try alternative approach if the model exists in schema but not in client
      status = await prisma.$queryRaw`SELECT * FROM "SiteStatus" LIMIT 1`;
      console.log('Fetched via raw query:', status);
      
      // If result is an array, take the first item
      if (Array.isArray(status) && status.length > 0) {
        status = status[0];
      }
    }
    
    if (!status) {
      console.log('No status found, creating one...');
      try {
        // @ts-ignore - TypeScript might not recognize the model yet
        status = await prisma.siteStatus.create({
          data: {
            isLocked: false,
            message: "The event draw has ended. Thank you for participating!"
          }
        });
        console.log('Created status:', status);
      } catch (err) {
        console.error('Error creating status:', err);
        
        // Try alternative approach with raw SQL
        status = await prisma.$executeRaw`
          INSERT INTO "SiteStatus" ("isLocked", "message", "updatedAt") 
          VALUES (false, 'The event draw has ended. Thank you for participating!', NOW())
          RETURNING *
        `;
        console.log('Created via raw query:', status);
        
        // Fetch the newly created record
        status = await prisma.$queryRaw`SELECT * FROM "SiteStatus" ORDER BY "id" DESC LIMIT 1`;
        if (Array.isArray(status) && status.length > 0) {
          status = status[0];
        }
      }
    }
    
    return NextResponse.json({ status });
  } catch (error) {
    console.error('Error in GET /api/site-status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site status', details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/site-status - Update site status (admin only)
export async function POST(request: Request) {
  try {
    console.log('Updating site status...');
    
    // Verify admin token
    if (!(await isAuthorized(request))) {
      console.log('Unauthorized attempt to update site status');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Request body:', body);
    
    const { isLocked, message } = body;

    // Check if we have valid data to update
    if (isLocked === undefined && !message) {
      console.log('No valid data to update');
      return NextResponse.json(
        { error: 'No valid data provided for update' },
        { status: 400 }
      );
    }

    let status;
    
    try {
      // Try to update with Prisma client first
      // @ts-ignore - TypeScript might not recognize the model yet
      status = await prisma.siteStatus.upsert({
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
      console.log('Updated status:', status);
    } catch (err) {
      console.error('Error in upsert:', err);
      
      // Try raw SQL approach
      const updateQuery = `
        UPDATE "SiteStatus" 
        SET ${isLocked !== undefined ? `"isLocked" = ${isLocked},` : ''} 
        ${message ? `"message" = '${message.replace(/'/g, "''")}',` : ''}
        "updatedAt" = NOW()
        WHERE "id" = 1
        RETURNING *
      `;
      
      console.log('Executing raw query:', updateQuery);
      
      status = await prisma.$queryRawUnsafe(updateQuery);
      console.log('Updated via raw query:', status);
      
      // If result is an array, take the first item
      if (Array.isArray(status) && status.length > 0) {
        status = status[0];
      } else {
        // If no record was updated, create one
        const insertQuery = `
          INSERT INTO "SiteStatus" ("isLocked", "message", "updatedAt") 
          VALUES (${!!isLocked}, '${(message || "The event draw has ended. Thank you for participating!").replace(/'/g, "''")}', NOW())
          RETURNING *
        `;
        
        console.log('Executing insert query:', insertQuery);
        
        status = await prisma.$queryRawUnsafe(insertQuery);
        console.log('Inserted via raw query:', status);
        
        if (Array.isArray(status) && status.length > 0) {
          status = status[0];
        }
      }
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('Error in POST /api/site-status:', error);
    return NextResponse.json(
      { error: 'Failed to update site status', details: String(error) },
      { status: 500 }
    );
  }
} 