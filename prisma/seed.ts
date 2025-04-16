import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// Basic password hashing function
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  // Check for required environment variables
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const token = process.env.ADMIN_TOKEN;

  if (!username || !password || !token) {
    console.error('Error: ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_TOKEN must be set in environment variables');
    process.exit(1);
  }

  // Create initial admin user
  const admin = await prisma.admin.upsert({
    where: { username },
    update: {
      passwordHash: hashPassword(password),
      token,
    },
    create: {
      username,
      passwordHash: hashPassword(password),
      token,
      role: 'admin',
    },
  });

  console.log(`Admin user created: ${admin.username}`);

  // Create a sample event if needed
  const event = await prisma.event.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Sample Event',
      date: new Date(),
      location: 'Sample Location',
      isActive: true,
    },
  });

  console.log(`Sample event created: ${event.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 