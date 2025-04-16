// Plain JavaScript seeding script that doesn't rely on TypeScript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to generate random phone numbers
function generatePhoneNumber() {
  return `07${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
}

// Function to generate random full names from lists
function generateFullName() {
  const firstNames = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Olivia',
    'Robert', 'Emily', 'William', 'Sophia', 'Joseph', 'Ava', 'Richard', 'Isabella',
    'Charles', 'Mia', 'Thomas', 'Charlotte', 'Daniel', 'Amelia', 'Matthew', 'Harper',
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia',
    'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore',
  ];
  
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

// Main seeding function
async function seedEntries() {
  console.log('Starting to seed test entries...');
  
  try {
    // Get the first event from the database or create a new one
    let event = await prisma.event.findFirst();
    
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
    } else {
      console.log(`Using existing event: ${event.name}`);
    }
    
    // Generate test entries
    const numEntries = 50;
    let successCount = 0;
    
    for (let i = 0; i < numEntries; i++) {
      try {
        await prisma.entry.create({
          data: {
            fullName: generateFullName(),
            phoneNumber: generatePhoneNumber(),
            eventId: event.id,
            isWinner: Math.random() < 0.1, // 10% chance of being a winner
          }
        });
        
        successCount++;
        
        // Log progress
        if ((i + 1) % 10 === 0 || i === numEntries - 1) {
          console.log(`Created ${successCount} entries so far...`);
        }
      } catch (entryError) {
        console.error(`Error creating entry #${i+1}:`, entryError.message);
      }
    }
    
    // Show final statistics
    const winners = await prisma.entry.count({ where: { isWinner: true } });
    const totalEntries = await prisma.entry.count();
    
    console.log(`\nSeeding complete!`);
    console.log(`Total entries in database: ${totalEntries}`);
    console.log(`Winners in database: ${winners}`);
    console.log(`Non-winners in database: ${totalEntries - winners}`);
    
  } catch (error) {
    console.error('Error in seeding process:', error.message);
  } finally {
    await prisma.$disconnect();
    console.log('\nDatabase connection closed.');
  }
}

// Run the seeding function
seedEntries(); 