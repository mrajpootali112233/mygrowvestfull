# MyGrowVest - Investment Platform

A full-stack investment platform built with Next.js 14 and NestJS, optimized for Vercel deployment.

## 🏗️ Project Structure

```
├── frontend/          # Next.js 14 frontend application
├── backend/           # NestJS backend API (Serverless ready)
├── vercel.json        # Root Vercel configuration
├── FULL_VERCEL_DEPLOYMENT.md # Complete deployment guide
├── deploy-vercel.ps1  # Automated deployment script
└── docker-compose.yml # Local development setup
```

## 🚀 Quick Deployment

### Option 1: Automated Script (Windows)
```powershell
.\deploy-vercel.ps1
```

### Option 2: Manual Deployment

#### Deploy Backend
```bash
cd backend
npx vercel --prod
```

#### Deploy Frontend
```bash
cd frontend
npx vercel --prod
```

### Option 3: Vercel Dashboard
1. Import repository to Vercel
2. Set **Root Directory**: `frontend` (for frontend)
3. Set **Root Directory**: `backend` (for backend)
4. Configure environment variables
5. Deploy

See [FULL_VERCEL_DEPLOYMENT.md](./FULL_VERCEL_DEPLOYMENT.md) for detailed instructions.

## 🔧 Environment Configuration

### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
NEXT_PUBLIC_APP_URL=https://your-frontend.vercel.app
NEXT_PUBLIC_BINANCE_DEPOSIT_ID=941704599
```

### Backend (.env.production)
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-jwt-secret
FRONTEND_URL=https://your-frontend.vercel.app
```

## 🏃‍♂️ Local Development

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL (production) or SQLite (development)

### Setup
```bash
# Clone repository
git clone <your-repo-url>
cd mygrowvest

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start development servers
cd backend && npm run start:dev    # Port 3000
cd frontend && npm run dev         # Port 3001
```

## 📊 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Charts**: Chart.js
- **Deployment**: Vercel

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL (production), SQLite (development)
- **ORM**: TypeORM
- **Authentication**: JWT
- **Deployment**: Vercel (Serverless)

## 🔒 Security Features

- JWT Authentication
- Role-based Access Control (RBAC)
- Input Validation
- CORS Configuration
- File Upload Validation
- Password Hashing (bcrypt)
- CSRF Protection
- Security Headers

## 📈 Features

- **User Management**: Registration, login, profile management
- **Investment Plans**: Multiple investment options with different returns
- **Deposit System**: Secure deposit with proof upload
- **Withdrawal System**: Automated withdrawal processing
- **Referral Program**: Multi-level referral system
- **Admin Dashboard**: Complete admin control panel
- **Support System**: Ticket-based support system
- **Analytics**: Investment tracking and profit calculations

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run cypress:run  # E2E tests
npm run lint         # Linting
```

### Backend Testing
```bash
cd backend
npm run test         # Unit tests
npm run test:e2e     # E2E tests
```

## 📝 Documentation

- [Complete Deployment Guide](./FULL_VERCEL_DEPLOYMENT.md)
- [API Documentation](./backend/API_EXAMPLES.md)
- [Frontend Components](./FRONTEND_SUMMARY.md)
- [Production Checklist](./PRODUCTION_CHECKLIST.md)
- [Changelog](./CHANGELOG.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary and confidential.

---

**🚀 Ready to deploy?** Follow the [deployment guide](./FULL_VERCEL_DEPLOYMENT.md) for step-by-step instructions.
