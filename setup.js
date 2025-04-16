// This is a simple setup script that can be run manually after deployment
// It verifies basic environment variables are available

console.log('Checking environment variables...');

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set!');
  console.error('Make sure to set this in your Vercel project settings.');
} else {
  console.log('✓ DATABASE_URL is set');
}

if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_TOKEN) {
  console.error('ERROR: Admin credentials are not fully set!');
  console.error('Make sure ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_TOKEN are set in your Vercel project settings.');
} else {
  console.log('✓ Admin credentials are set');
}

console.log('\nReminder: After deployment, you need to:');
console.log('1. Run database migrations');
console.log('2. Seed initial admin user');
console.log('\nYou can do this by visiting your deployment URL or running:');
console.log('npx prisma migrate deploy');
console.log('npx prisma db seed'); 