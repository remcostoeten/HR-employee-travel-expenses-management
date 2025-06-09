# Authentication Demo

A clean, modern authentication system built with Next.js, focusing on security and user experience.

## 🏗️ Architecture Overview

This application demonstrates a complete authentication system with:

- **Email/Password Authentication**: Secure login and registration
- **OAuth Integration**: GitHub, Google, and Discord login
- **Session Management**: JWT-based sessions with secure cookies
- **Password Security**: Bcrypt hashing with salt rounds
- **Type Safety**: Full TypeScript coverage from database to UI

## 📁 Project Structure

```
src/
├── api/
│   ├── db/              # Database configuration and migrations
│   └── env.ts           # Environment configuration
├── modules/
│   └── authenticatie/   # Authentication module
│       ├── context/     # React context for user state
│       ├── helpers/     # JWT, password hashing, sessions
│       ├── hooks/       # Authentication hooks
│       ├── schemas/     # Database schemas
│       ├── server/      # Server actions and repositories
│       ├── services/    # OAuth services
│       ├── types/       # Type definitions
│       └── ui/          # Authentication components
├── shared/             # Shared utilities and components
│   ├── components/     # Shared UI components
│   ├── types/         # Common type definitions
│   └── utilities/     # Shared utilities
└── app/               # Next.js app router pages
    ├── (auth)/        # Authentication pages
    └── api/auth/      # Authentication API routes
```

## 🔐 Authentication Flow

### 1. Registration
```typescript
// User registers with email/password
const result = await registerUser({
  email: "user@example.com",
  password: "securePassword123",
  name: "John Doe"
});
```

### 2. Login
```typescript
// User logs in with credentials
const session = await loginUser({
  email: "user@example.com",
  password: "securePassword123"
});
```

### 3. OAuth Integration
```typescript
// OAuth providers (GitHub, Google, Discord)
const authUrl = await getOAuthUrl("github");
// Redirect to provider, then handle callback
```

### 4. Session Management
```typescript
// JWT-based sessions with secure cookies
const session = await getSession();
if (session) {
  // User is authenticated
  console.log(session.user);
}
```

## 🔑 Key Features

### Security First
- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure session management
- **CSRF Protection**: Built-in Next.js protection
- **Secure Cookies**: HttpOnly, Secure, SameSite

### OAuth Integration
- **GitHub**: Complete OAuth flow
- **Google**: Google OAuth 2.0
- **Discord**: Discord OAuth integration
- **Extensible**: Easy to add more providers

### User Experience
- **Responsive Design**: Mobile-first approach
- **Form Validation**: Real-time validation with Zod
- **Error Handling**: Comprehensive error messages
- **Loading States**: Smooth user interactions

### Developer Experience
- **Type Safety**: Full TypeScript coverage
- **Modular Code**: Clean separation of concerns
- **Reusable Components**: Shared UI components
- **Easy Testing**: Well-structured for testing

## 🛠️ Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Custom JWT + OAuth
- **UI**: Tailwind CSS + Radix UI
- **Forms**: React Hook Form + Zod validation
- **State**: React Context + Zustand

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your database and OAuth credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Visit the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser
