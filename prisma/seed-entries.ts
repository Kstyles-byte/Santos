import { PrismaClient, Entry } from '@prisma/client';

const prisma = new PrismaClient();

// Function to generate random phone numbers
function generatePhoneNumber(): string {
  return `07${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
}

// Function to generate random full names from lists
function generateFullName(): string {
  const firstNames = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Olivia',
    'Robert', 'Emily', 'William', 'Sophia', 'Joseph', 'Ava', 'Richard', 'Isabella',
    'Charles', 'Mia', 'Thomas', 'Charlotte', 'Daniel', 'Amelia', 'Matthew', 'Harper',
    'Anthony', 'Evelyn', 'Joshua', 'Abigail', 'Andrew', 'Elizabeth', 'Christopher', 'Sofia'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia',
    'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore',
    'Martin', 'Jackson', 'Thompson', 'White', 'Lopez', 'Lee', 'Gonzalez', 'Harris',
    'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall', 'Young', 'Allen'
  ];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
}

async function seedEntries() {
  console.log('Starting to seed test entries...');
  
  // Get the first event from the database to associate entries with
  let event = await prisma.event.findFirst();
  
  // If no event exists, create one
  if (!event) {
    event = await prisma.event.create({
      data: {
        name: 'Test Event',
        date: new Date(),
        location: 'Test Location',
        isActive: true,
      }
    });
    console.log(`Created test event: ${event.name}`);
  }
  
  // Generate 50 test entries
  const numEntries = 50;
  const createdEntries: Entry[] = []; // Explicitly type the array as Entry[]
  
  for (let i = 0; i < numEntries; i++) {
    const entry = await prisma.entry.create({
      data: {
        fullName: generateFullName(),
        phoneNumber: generatePhoneNumber(),
        eventId: event.id,
        // Most entries should not be winners initially
        isWinner: Math.random() < 0.1, // 10% chance of being a winner
      }
    });
    createdEntries.push(entry);
    
    // Log progress every 10 entries
    if ((i + 1) % 10 === 0) {
      console.log(`Created ${i + 1} of ${numEntries} entries...`);
    }
  }
  
  console.log(`Seeded ${createdEntries.length} test entries successfully!`);
  
  // Log some statistics
  const winnerCount = createdEntries.filter(entry => entry.isWinner).length;
  console.log(`Created ${winnerCount} pre-selected winners and ${createdEntries.length - winnerCount} non-winners`);
}

// Execute the seeding function
seedEntries()
  .catch((e) => {
    console.error('Error seeding entries:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the Prisma client connection
    await prisma.$disconnect();
  }); 