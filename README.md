# HR Expenses - Travel Management System

A modern, comprehensive employee travel expense management system built with Next.js. Automatically calculate commuting costs, manage employee data, and track travel expenses with real-time analytics.

## 🌟 Features

### 💼 Employee Management
- **Employee Registration**: Add employees with home address, travel type, and office days
- **Automatic Distance Calculation**: Uses Geoapify API to calculate commuting distances
- **Travel Type Support**: Car, public transport, and bike commuting options
- **Cost Calculation**: Automatic monthly cost calculation based on distance and office days
- **Search & Filter**: Quickly find employees by name, address, or travel type
- **CRUD Operations**: Create, view, and delete employees with confirmation dialogs

### 📊 Dashboard & Analytics
- **Real-time Statistics**: Total employees, distances, and monthly costs
- **Travel Type Breakdown**: Visual breakdown of transportation methods
- **Cost Analysis**: Average costs per employee and total expenses
- **Interactive Charts**: Cost distribution by travel type
- **Monthly Summaries**: Overview of all expense data

### 🔐 Authentication & Security
- **Secure Login/Registration**: JWT-based authentication with password hashing
- **OAuth Integration**: Google and GitHub OAuth support
- **Role-based Access**: Admin and user roles with appropriate permissions
- **Protected Routes**: All application pages require authentication
- **Session Management**: Persistent sessions with automatic refresh

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Built-in theme switching
- **Toast Notifications**: Real-time feedback for all user actions
- **Loading States**: Skeleton loading for better user experience
- **Sidebar Navigation**: Collapsible sidebar with breadcrumb navigation
- **Professional Design**: Clean, modern interface built with Tailwind CSS

### 📈 Reports & Analytics
- **Expense Overview**: Comprehensive dashboard with key metrics
- **Travel Patterns**: Analysis of employee commuting patterns
- **Cost Optimization**: Insights for reducing travel expenses
- **Export Ready**: Structure prepared for PDF/Excel exports (coming soon)

## 🏗️ Architecture

### Modular Design
```
src/
├── modules/
│   ├── employees/           # Employee management module
│   │   ├── components/      # UI components
│   │   ├── api/            # API queries and mutations
│   │   │   ├── queries/    # Data fetching
│   │   │   └── mutations/  # Data modifications
│   │   ├── hooks/          # Custom React hooks
│   │   ├── schemas/        # Database schemas
│   │   └── utilities/      # Helper functions
│   ├── authenticatie/      # Authentication module
│   └── admin/             # Admin management module
├── components/
│   └── layouts/           # Layout components
├── shared/
│   ├── components/ui/     # Reusable UI components
│   ├── utilities/         # Shared utilities
│   └── types/            # Common TypeScript types
├── app/                  # Next.js App Router pages
└── views/               # Page view components
```

### Database Schema
```sql
-- Employees table
employees {
  id: string (UUID)
  userId: string (FK)
  name: string
  homeAddress: string
  travelType: 'car' | 'public' | 'bike'
  officeDays: string[] (JSON)
  distanceKm: number
  euroPerKm: number (default: 21 cents)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Key Technologies
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for full type safety
- **Database**: SQLite with Drizzle ORM
- **Authentication**: Custom JWT + OAuth (Google, GitHub)
- **UI**: Tailwind CSS + Radix UI components
- **Maps/Distance**: Geoapify API for distance calculation
- **State Management**: React Context + useReducer
- **Forms**: Custom form handling with validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Bun (recommended package manager)
- Geoapify API key (for distance calculation)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/remcostoeten/hr-expenses.git
   cd hr-expenses
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Configure the required environment variables:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # JWT Authentication
   JWT_SECRET="your-super-secret-jwt-key"

   # Geoapify API (for distance calculation)
   GEOAPIFY_API_KEY="your-geoapify-api-key"

   # Office Address (for distance calculation)
   OFFICE_ADDRESS="Your Office Address, City, Country"

   # Admin Email (first admin user)
   ADMIN_EMAIL="admin@yourcompany.com"

   # OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

s### First Time Setup

1. **Register an account** or use OAuth login
2. **Set admin role** for the first user (if using ADMIN_EMAIL)
3. **Add your first employee** in the Employee Management section
4. **Explore the dashboard** to see calculated expenses

## 📱 Application Pages

### 🏠 Dashboard (`/space`)
- Employee statistics overview
- Monthly cost summaries
- Travel type breakdown
- Cost analysis charts

### 👥 Employee Management (`/space/employees`)
- **Overview Tab**: Search and view all employees
- **Create Tab**: Add new employees with travel details
- Employee actions: View details, delete with confirmation

### 📊 Reports (`/space/reports`)
- Expense analytics (coming soon)
- Monthly/yearly reports (coming soon)
- Export functionality (coming soon)

### ⚙️ Admin Dashboard (`/space/admin`)
- User management (admin only)
- System settings
- Application statistics

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | Database connection string | Yes | `file:./dev.db` |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `GEOAPIFY_API_KEY` | API key for distance calculation | Yes | - |
| `OFFICE_ADDRESS` | Company office address | Yes | - |
| `ADMIN_EMAIL` | Email for first admin user | No | - |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No | - |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | No | - |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | No | - |

### Distance Calculation
The application uses the Geoapify API to calculate distances between employee home addresses and the office. You'll need to:

1. **Sign up** for a free Geoapify account
2. **Get your API key** from the dashboard
3. **Add the key** to your environment variables
4. **Set your office address** in the environment variables

### Cost Calculation Formula
```
Monthly Cost = Distance (km) × €0.21 × Number of Office Days × 4.33 weeks
```

## 🛠️ Development

### Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun start            # Start production server

# Database
bun run db:push      # Push schema changes to database
bun run db:studio    # Open Drizzle Studio (database GUI)
bun run db:generate  # Generate database migrations

# Code Quality
bun run lint         # Run ESLint
bun run type-check   # Run TypeScript type checking
```

### Adding New Features

#### Adding a New Employee Field
1. **Update the schema** in `src/modules/employees/schemas/employee-schema.ts`
2. **Run database migration** with `npm run db:push`
3. **Update the form** in `src/modules/employees/components/create-employee-form.tsx`
4. **Update TypeScript types** in the component files

#### Adding New Travel Types
1. **Update the TravelType enum** in the schema
2. **Add new icons** in the component files
3. **Update the form options** in the create employee form

#### Customizing Cost Calculation
1. **Modify the calculation** in `src/modules/employees/api/mutations/create-employee.ts`
2. **Update the preview calculation** in the form component

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - automatic builds and deployments

### Manual Deployment

1. **Build the application**
   ```bash
   bun run build
   ```

2. **Set up production database**
   ```bash
   bun run db:push
   ```

3. **Start the production server**
   ```bash
   bun start
   ```

## 📊 Usage Examples

### Creating an Employee
```typescript
// Employee data structure
const employee = {
  name: "John Doe",
  homeAddress: "123 Main St, Amsterdam, Netherlands",
  travelType: "car", // or "public" or "bike"
  officeDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
};

// Automatic calculation will determine:
// - Distance from home to office
// - Monthly commuting cost
// - Travel expense breakdown
```

### Dashboard Analytics
The dashboard automatically shows:
- **Total employees** in the system
- **Average commuting distance** per employee
- **Total monthly costs** for all employees
- **Breakdown by travel type** (car vs public vs bike)
- **Cost distribution** and optimization opportunities

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt for password security
- **Protected Routes**: All application routes require authentication
- **Role-based Access**: Admin features restricted to admin users
- **Input Validation**: All forms validated on client and server
- **SQL Injection Protection**: Drizzle ORM prevents SQL injection
- **XSS Protection**: React's built-in XSS protection

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use the existing component patterns
- Add proper error handling
- Include toast notifications for user feedback
- Maintain responsive design principles
- Write meaningful commit messages

## 🗺️ Roadmap

### Phase 1 (Current - MVP)
- ✅ Employee management (CRUD)
- ✅ Automatic distance/cost calculation
- ✅ Dashboard with basic analytics
- ✅ Authentication and user management
- ✅ Responsive UI with modern design

### Phase 2 (Next Release)
- 📅 Advanced reporting and analytics
- 📅 Export to PDF/Excel functionality
- 📅 Monthly/yearly expense reports
- 📅 Employee expense history
- 📅 Bulk employee import/export
- 📅 Email notifications for expense updates

### Phase 3 (Future)
- 📅 Mobile app (React Native)
- 📅 Integration with accounting software
- 📅 Advanced cost optimization recommendations
- 📅 Multi-office support
- 📅 Expense approval workflows
- 📅 Real-time expense tracking

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Next.js](https://nextjs.org/)** - The React framework for production
- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe database operations
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Geoapify](https://www.geoapify.com/)** - Location and mapping services
- **[Lucide Icons](https://lucide.dev/)** - Beautiful & consistent icons

## 📞 Support

For support, email support@yourcompany.com or create an issue in the GitHub repository.

---

**Built with ❤️ for efficient employee travel expense management**
