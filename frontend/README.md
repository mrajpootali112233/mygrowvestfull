# MyGrowVest Frontend

A modern Next.js 14 frontend application for the MyGrowVest investment platform, featuring glassmorphism design, real-time charts, and full backend integration.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 App Router, TypeScript, TailwindCSS
- **Beautiful UI**: Glassmorphism design system with responsive layouts
- **Interactive Charts**: Chart.js integration for profit visualization
- **Smooth Animations**: Framer Motion for enhanced user experience
- **Full Authentication**: JWT-based auth with role-based redirects
- **Complete User Flows**: Registration, login, deposits, withdrawals, referrals
- **Admin Dashboard**: Management interface for administrators
- **SEO Optimized**: Meta tags, sitemap, and accessibility features
- **Production Ready**: Vercel deployment configuration

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Backend API running (see `/backend` folder)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and configure:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   NEXT_PUBLIC_APP_NAME=MyGrowVest
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

4. **Start Development Server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (public)/          # Public pages (home, about, etc.)
│   │   ├── dashboard/         # User dashboard pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── login/             # Authentication
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── ui/                # UI components (Modal, Table, etc.)
│   │   └── dashboard/         # Dashboard-specific components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and API service
│   └── mocks/                 # Mock data for development
├── public/                    # Static assets
├── tailwind.config.ts         # TailwindCSS configuration
├── next.config.js             # Next.js configuration
├── vercel.json                # Vercel deployment config
└── package.json               # Dependencies and scripts
```

## 🎨 Design System

The application uses a custom glassmorphism design system built with TailwindCSS:

- **Glass Cards**: `.glass-card` class for frosted glass effect
- **Buttons**: `.btn-primary`, `.btn-secondary` for consistent styling
- **Color Palette**: Purple/blue gradients with glass effects
- **Typography**: Responsive text scales with proper contrast
- **Animations**: Smooth transitions and hover effects

## 📱 Pages & Features

### Public Pages
- **Home** (`/`) - Landing page with hero and features
- **About** (`/about`) - Company information
- **Plans** (`/plans`) - Investment plans showcase
- **Contact** (`/contact`) - Contact form
- **FAQ** (`/faq`) - Frequently asked questions
- **Legal** (`/privacy-policy`, `/terms-and-conditions`)

### Authentication
- **Login/Register** (`/login`) - Combined auth page with role-based redirects
- **Password Reset** - Forgot password functionality

### User Dashboard (`/dashboard`)
- **Overview** - Account stats and quick actions
- **Deposits** - Make deposits with Binance instructions (ID: 941704599)
- **Plans** - Activate investment plans
- **Withdrawals** - Request withdrawals (min $20)
- **Referrals** - Generate referral links and track commissions
- **Support** - Create and manage support tickets

### Admin Dashboard (`/admin`)
- **Overview** - System statistics and quick actions
- **User Management** - Manage user accounts
- **Deposit Approval** - Review and approve deposits
- **Withdrawal Processing** - Process withdrawal requests
- **System Tools** - Admin utilities and reports

## 🔧 Configuration

### API Integration
The app uses axios with JWT interceptors for API communication:
- Automatic token attachment
- Token refresh handling
- CSRF protection
- Mock fallback for development

### Charts & Analytics
- Chart.js for interactive profit charts
- Real-time data visualization
- Responsive chart designs
- Multiple chart types (line, bar, doughnut)

### SEO & Performance
- Dynamic meta tags per page
- Automatic sitemap generation
- Optimized images and fonts
- Performance monitoring ready

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   vercel link
   ```

2. **Set Environment Variables**
   - `NEXT_PUBLIC_API_URL` - Your backend API URL
   - `NEXT_PUBLIC_APP_NAME` - Application name
   - `NEXT_PUBLIC_APP_URL` - Frontend domain

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Start production server**
   ```bash
   pnpm start
   ```

## 🔗 Backend Integration

Ensure your backend API is running and accessible. The frontend expects these endpoints:

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /plans` - Available investment plans
- `POST /deposits` - Create deposits
- `POST /withdrawals` - Request withdrawals
- `GET /referrals` - Referral data
- `POST /tickets` - Support tickets

## 🧪 Development Features

### Mock API
The app includes mock API responses for development when the backend is unavailable:
- Sample user data
- Mock investment plans
- Simulated transactions
- Fallback responses

### Hot Reload
Next.js provides instant hot reload for development:
- Component updates
- Style changes
- Route modifications

## 📦 Dependencies

### Core
- `next` - React framework
- `react` - UI library
- `typescript` - Type safety

### UI & Styling
- `tailwindcss` - Utility-first CSS
- `framer-motion` - Animations
- `chart.js` - Charts and graphs

### API & State
- `axios` - HTTP client
- `react-hook-form` - Form handling
- `zod` - Schema validation

## 🔒 Security Features

- JWT token management
- CSRF protection
- Input validation
- Secure API communication
- Role-based access control

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Check `NEXT_PUBLIC_API_URL` in `.env.local`
   - Ensure backend is running
   - Verify CORS settings

2. **Charts Not Displaying**
   - Check Chart.js dependencies
   - Verify data format
   - Check console for errors

3. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `pnpm install`
   - Check TypeScript errors

### Performance Tips

1. **Optimize Images**
   - Use Next.js Image component
   - Implement proper image formats
   - Add loading states

2. **Code Splitting**
   - Use dynamic imports for large components
   - Implement lazy loading
   - Optimize bundle size

## 📄 License

This project is part of the MyGrowVest investment platform.

## 📞 Support

For technical issues or questions:
- Check the troubleshooting section
- Review the backend API documentation
- Contact the development team

---

**Note**: This frontend is designed to work with the MyGrowVest backend API. Ensure proper backend setup for full functionality.