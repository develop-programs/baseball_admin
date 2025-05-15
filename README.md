# Baseball Admin Portal

A comprehensive administration portal for managing baseball player registrations. This application allows administrators to review, approve, or reject player registration applications, and provides players with a simple registration interface.

## Overview

The Baseball Admin Portal is built using Next.js 15 with TypeScript and MongoDB. It includes:

- Player registration system
- Admin authentication and authorization
- Dashboard with key statistics
- Player management interface
- API endpoints for all CRUD operations

## Features

### For Administrators

- **Secure Login**: Role-based authentication system
- **Dashboard**: View registration statistics and recent activities
- **Player Management**: Review, approve, or reject player registrations
- **Player Details**: View comprehensive player information

### For Players

- **Registration Form**: Simple registration process
- **Status Tracking**: Check application status

## Installation

### Prerequisites

- Node.js 18.x or higher
- MongoDB instance
- Bun (optional, for faster package management)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd baseball_admin
```

2. Install dependencies:
```bash
npm install
# or with Bun
bun install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
# MongoDB
MONGODB_URI=mongodb://your-mongodb-uri

# NextAuth
NEXT_AUTH_SECRET=your-auth-secret
NEXTAUTH_URL=http://localhost:3000

# Admin Setup
ADMIN_SETUP_KEY=your-admin-setup-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
# or with Bun
bun run dev
```

5. Build for production:
```bash
npm run build
# or with Bun
bun run build
```

6. Start in production mode:
```bash
npm start
# or with Bun
bun start
```

### Setting up the first admin

Use the admin setup API to create your first administrator:

```bash
curl -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-secure-password",
    "email": "admin@example.com",
    "key": "your-admin-setup-key"
  }'
```

The first admin created will automatically have the `super_admin` role.

## Project Structure

```
baseball_admin/
├── public/              # Static files
├── src/
│   ├── app/             # App router pages and API routes
│   │   ├── admin/       # Admin dashboard pages
│   │   ├── api/         # API endpoints
│   │   ├── auth/        # Authentication pages
│   │   └── player/      # Player-facing pages
│   ├── components/      # React components
│   │   ├── custom/      # Custom components
│   │   └── ui/          # UI components
│   ├── lib/             # Utility libraries
│   ├── services/        # Backend services
│   │   └── schema/      # MongoDB schemas
│   └── types/           # TypeScript type definitions
├── .env                 # Environment variables (not in repo)
└── package.json         # Project dependencies
```

## API Documentation

### Authentication

- **POST `/api/auth/signin`**: Sign in with credentials
- **GET `/api/auth/signout`**: Sign out

### Admin Endpoints

- **GET `/api/info`**: Get dashboard statistics
- **GET `/api/admin/players`**: List all players with pagination
- **GET `/api/admin/players/[id]`**: Get player details
- **PATCH `/api/admin/players/[id]`**: Update player details
- **DELETE `/api/admin/players/[id]`**: Delete player
- **POST `/api/admin/setup`**: Create admin user

### Player Endpoints

- **POST `/api/player/register`**: Register new player

## Database Schema

### Player Model

```typescript
{
  fullName: string;      // Player's full name
  fatherName: string;    // Father's name
  motherName: string;    // Mother's name
  dob: string;           // Date of birth
  gender: string;        // Gender
  phone: string;         // Contact phone number
  addhaar: string;       // Aadhaar number (unique)
  email: string;         // Email address (unique)
  profileimg: string;    // Profile image URL
  addharImg: string;     // Aadhaar image URL
  region: string;        // Region
  state: string;         // State
  district: string;      // District
  registrationDate: Date;// Registration date
  status: string;        // Status: pending, approved, or rejected
}
```

### Admin Model

```typescript
{
  username: string;      // Admin username (unique)
  password: string;      // Hashed password
  email: string;         // Admin email (unique)
  role: string;          // Role: admin or super_admin
}
```

## Technologies Used

- **Frontend**:
  - Next.js 15
  - React 19
  - Tailwind CSS 4
  - shadcn/ui components
  - React Hook Form
  - Zod validation

- **Backend**:
  - Next.js API Routes
  - MongoDB with Mongoose
  - NextAuth.js for authentication
  - bcrypt for password hashing

## Contributing

Please follow the project's coding style and submit pull requests for any contributions.

## License

[Specify your license here]
