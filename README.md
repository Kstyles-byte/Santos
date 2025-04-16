# Santos Event Draw Entry System

A digital solution for Santos clothing brand to collect participant information during promotional events and randomly select winners for prizes.

## Tech Stack

- **Frontend**: React Native Web
- **Backend API**: Next.js API routes on Vercel
- **Database**: PostgreSQL on Neon.tech
- **ORM**: Prisma
- **Authentication**: Basic token authentication
- **Winner Selection**: SQL ORDER BY RANDOM()
- **Data Export**: JSON/CSV endpoints

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Neon.tech account for PostgreSQL database
- Vercel account for deployment
- Git for version control

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd santos-event-system

# Install dependencies
npm install
```

### Step 2: Set Up Database on Neon.tech

1. Create a new project on [Neon.tech](https://neon.tech)
2. From the dashboard, create a new PostgreSQL database
3. Get your connection string from the "Connection Details" section
4. It should look like: `postgresql://username:password@endpoint:5432/database?sslmode=require`

### Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your database connection string and admin credentials:
   ```
   DATABASE_URL="postgresql://username:password@endpoint:5432/database?sslmode=require"
   ADMIN_USERNAME="your_admin_username"
   ADMIN_PASSWORD="your_secure_password"
   ADMIN_TOKEN="your_secure_token"
   ```

   Note: You'll need to create a secure token for the admin. This can be any string, but for security, use a random string generator like `openssl rand -hex 32`.

### Step 4: Set Up the Database Schema

```bash
# Generate Prisma client
npx prisma generate

# Push the schema to your database
npx prisma db push

# Seed the initial admin user and sample event
npx prisma db seed
```

### Step 5: Running Locally

```bash
# Start the development server
npm run dev
```

Your app should now be running on [http://localhost:3000](http://localhost:3000)

### Step 6: Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your Vercel account to your repository
3. Import the project in Vercel
4. Add the environment variables from your `.env` file to Vercel
5. Deploy!

## Application Structure

### Public-Facing Pages

- **Entry Form** (`/`): The main page where attendees can submit their information
  - Collects full name and phone number
  - Confirms successful entry

### Admin Pages

- **Admin Dashboard** (`/admin`): Password-protected area for Santos staff
  - View all entries in a table format
  - Randomly select winners with animations
  - Export entry data as CSV or JSON
  - Authentication using admin token

## API Endpoints

### Public Endpoints

- `POST /api/entries` - Submit a new entry
  - Body: `{ "fullName": "Name", "phoneNumber": "123456789", "eventId": 1 }`

### Admin Endpoints (Require Authentication)

- `GET /api/entries` - Get all entries
- `POST /api/draw-winner` - Randomly select a winner
- `GET /api/export?format=csv` - Export entries (JSON or CSV)
- `POST /api/admin/login` - Admin login

## Authentication

All admin endpoints require the `x-admin-token` header with the admin token value.

## Customizing

- Brand colors and styling can be adjusted in `src/constants/Colors.ts`
- Database schema can be extended by modifying the `prisma/schema.prisma` file
- Admin functionality can be enhanced by updating the `src/app/admin/page.tsx` file

## License

This project is proprietary and for use by Santos Clothing Brand only. 