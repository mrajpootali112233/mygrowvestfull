# MyGrowVest Backend

A production-ready NestJS backend for MyGrowVest investment platform with TypeORM, PostgreSQL/SQLite, JWT authentication, RBAC, and comprehensive API endpoints.

## Features

- **Authentication & Authorization**
  - JWT-based authentication with access and refresh tokens
  - Role-based access control (User/Admin)
  - Password hashing with bcrypt
  - Protected routes with guards

- **Database**
  - PostgreSQL for production
  - SQLite fallback for local development
  - TypeORM with migrations
  - Comprehensive entity relationships

- **Investment System**
  - Multiple investment plans (Plan A: 3% daily, Plan B: 7% daily)
  - Automated profit distribution
  - Investment tracking and management

- **Financial Operations**
  - Deposit management with proof upload
  - Withdrawal requests and approvals
  - Admin approval workflows

- **Additional Features**
  - Referral system
  - Support ticket system
  - File upload capabilities
  - Admin logging
  - API validation and error handling

## Technology Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL (production) / SQLite (development)
- **ORM**: TypeORM
- **Authentication**: JWT + Passport
- **File Upload**: Multer
- **Validation**: Class-validator & Class-transformer
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v16 or later)
- npm/yarn/pnpm
- PostgreSQL (for production)
- Git

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database (PostgreSQL for production)
   DATABASE_TYPE=postgres
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=your_username
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=mygrowvest
   
   # For local development (SQLite)
   # DATABASE_TYPE=sqlite
   # DATABASE_NAME=./mygrowvest.db
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=1d
   
   # Admin User
   ADMIN_EMAIL=admin@mygrowvest.com
   ADMIN_PASSWORD=AdminPassword123!
   
   # Application
   NODE_ENV=development
   PORT=3000
   ```

## Database Setup

### Local Development (SQLite)

1. **Set database type in .env:**
   ```env
   DATABASE_TYPE=sqlite
   DATABASE_NAME=./mygrowvest.db
   ```

2. **Run migrations:**
   ```bash
   npm run migration:run
   ```

### Production (PostgreSQL)

1. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE mygrowvest;
   ```

2. **Set database configuration in .env:**
   ```env
   DATABASE_TYPE=postgres
   DATABASE_HOST=your_host
   DATABASE_PORT=5432
   DATABASE_USERNAME=your_username
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=mygrowvest
   ```

3. **Run migrations:**
   ```bash
   npm run migration:run
   ```

## Database Migrations

The application includes pre-built migrations that create all necessary tables and seed initial data.

### Available Migration Commands

```bash
# Run all pending migrations
npm run migration:run

# Generate a new migration (after entity changes)
npm run migration:generate -- src/migrations/MigrationName

# Revert the last migration
npm run migration:revert
```

### Migration Files

1. **InitialMigration** - Creates all database tables
2. **SeedPlans** - Inserts Plan A and Plan B

## Admin User Creation

Create an admin user using the CLI command:

```bash
npm run cli:create-admin
```

This command:
- Creates an admin user with credentials from `.env`
- Upgrades existing users to admin if they already exist
- Generates a unique referral code

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/:id` - Get user profile (own profile or admin)
- `PATCH /api/users/:id` - Update user (admin only)

### Deposits
- `POST /api/deposits` - Create deposit with proof upload
- `GET /api/deposits` - Get deposits (admin only, with filters)

### Withdrawals
- `POST /api/withdrawals` - Create withdrawal request
- `GET /api/withdrawals` - Get withdrawals (admin only, with filters)

### Investments
- `POST /api/investments/activate` - Activate investment

### Admin
- `PATCH /api/admin/deposits/:id/approve` - Approve deposit
- `PATCH /api/admin/deposits/:id/reject` - Reject deposit
- `PATCH /api/admin/withdrawals/:id/approve` - Approve withdrawal
- `PATCH /api/admin/withdrawals/:id/reject` - Reject withdrawal
- `POST /api/admin/run-daily-profit` - Run daily profit distribution

### Support Tickets
- `POST /api/tickets` - Create support ticket
- `GET /api/tickets/:id` - Get ticket details
- `POST /api/tickets/:id/reply` - Reply to ticket (admin only)

## Testing the API

### Using cURL

1. **Register a new user:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \\n     -H \"Content-Type: application/json\" \\n     -d '{
       \"email\": \"user@example.com\",
       \"password\": \"password123\"
     }'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \\n     -H \"Content-Type: application/json\" \\n     -d '{
       \"email\": \"user@example.com\",
       \"password\": \"password123\"
     }'
   ```

3. **Access protected route:**
   ```bash
   curl -X GET http://localhost:3000/api/users/1 \\n     -H \"Authorization: Bearer YOUR_JWT_TOKEN\"
   ```

### Using Postman/Insomnia

Import the provided collection or create requests manually:
- Set `Authorization` header: `Bearer <your-jwt-token>`
- Set `Content-Type` header: `application/json`

## Investment Plans

The system includes two pre-seeded investment plans:

- **Plan A**: 3% daily return, 30-day lock period, refundable principal
- **Plan B**: 7% daily return, 90-day lock period, non-refundable principal

## File Uploads

The system supports file uploads for:
- Deposit proof uploads
- Supported formats: JPEG, PNG, GIF, PDF
- Max file size: 5MB
- Files are stored in `/uploads` directory

## Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: User and Admin roles
- **Input Validation**: Class-validator for request validation
- **CORS Configuration**: Configurable cross-origin requests
- **File Upload Validation**: Type and size restrictions

## Environment Variables

See `.env.example` for all available configuration options:

- Database configuration
- JWT secrets and expiration
- Admin user credentials
- File upload settings
- CORS configuration

## Scripts

```bash
# Development
npm run start:dev          # Start in development mode
npm run start:debug        # Start in debug mode

# Production
npm run build              # Build the application
npm run start:prod         # Start in production mode

# Database
npm run migration:run      # Run migrations
npm run migration:generate # Generate new migration
npm run migration:revert   # Revert last migration

# CLI
npm run cli:create-admin   # Create admin user

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run e2e tests
npm run test:cov           # Run tests with coverage
```

## Project Structure

```
src/
├── auth/                  # Authentication module
├── users/                 # User management
├── deposits/              # Deposit management
├── withdrawals/           # Withdrawal management
├── investments/           # Investment management
├── admin/                 # Admin operations
├── tickets/               # Support tickets
├── entities/              # TypeORM entities
├── migrations/            # Database migrations
├── config/                # Configuration files
├── common/                # Shared utilities
├── cli/                   # CLI commands
├── app.module.ts          # Main application module
└── main.ts                # Application entry point
```

## Deployment

### Production Checklist

1. Set `NODE_ENV=production` in environment
2. Configure PostgreSQL database
3. Set strong JWT secrets
4. Configure file upload directory
5. Set up SSL/TLS certificates
6. Configure reverse proxy (Nginx/Apache)
7. Set up monitoring and logging
8. Run migrations: `npm run migration:run`
9. Create admin user: `npm run cli:create-admin`

### Docker Deployment (Optional)

Create a `Dockerfile` for containerized deployment:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD [\"npm\", \"run\", \"start:prod\"]
```

## Contributing

1. Follow TypeScript and NestJS best practices
2. Write tests for new features
3. Update documentation
4. Use conventional commits
5. Run linting before committing

## Troubleshooting

### Common Issues

1. **Database connection errors**:
   - Check database credentials in `.env`
   - Ensure database server is running
   - Verify network connectivity

2. **Migration errors**:
   - Check entity definitions
   - Ensure database exists
   - Run migrations individually if needed

3. **JWT token errors**:
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper token format

4. **File upload errors**:
   - Check file permissions
   - Verify upload directory exists
   - Check file size and type restrictions

### Logging

The application uses NestJS Logger for debugging:
- Set log level in environment
- Check console output for errors
- Review database logs for SQL issues

## Support

For issues and questions:
1. Check this documentation
2. Review error logs
3. Check GitHub issues
4. Contact development team

## License

This project is licensed under the MIT License.
