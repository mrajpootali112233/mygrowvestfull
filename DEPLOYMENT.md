# MyGrowVest Deployment Guide

This guide covers deploying MyGrowVest to production using Railway/Render for the backend and Vercel for the frontend.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Railway)](#backend-deployment-railway)
3. [Backend Deployment (Render Alternative)](#backend-deployment-render-alternative)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Docker Setup](#docker-setup)
6. [Environment Variables](#environment-variables)
7. [Database Setup](#database-setup)
8. [Domain Configuration](#domain-configuration)
9. [Monitoring & Logging](#monitoring--logging)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed locally
- Git repository with your code
- Railway/Render account for backend
- Vercel account for frontend
- PostgreSQL database (Railway/Render provides this)
- Domain name (optional)

## Backend Deployment (Railway)

### Step 1: Prepare Your Backend

1. **Create Production Environment File**
   
   Create `.env.production` in your backend directory:
   ```env
   NODE_ENV=production
   PORT=8080
   
   # Database (Railway will provide these)
   DATABASE_URL=${DATABASE_URL}
   DB_HOST=${PGHOST}
   DB_PORT=${PGPORT}
   DB_USERNAME=${PGUSER}
   DB_PASSWORD=${PGPASSWORD}
   DB_DATABASE=${PGDATABASE}
   
   # JWT Configuration
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-here
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d
   
   # File Upload Configuration
   MAX_FILE_SIZE=5242880
   UPLOAD_DEST=./uploads
   
   # CORS Configuration
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   
   # Rate Limiting
   RATE_LIMIT_MAX=100
   RATE_LIMIT_WINDOW_MS=900000
   
   # Logging
   LOG_LEVEL=info
   
   # Email Configuration (Optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   
   # Encryption Keys
   ENCRYPTION_KEY=your-32-character-encryption-key-here
   ```

2. **Update package.json**
   
   Ensure your `package.json` has the correct scripts:
   ```json
   {
     \"scripts\": {
       \"build\": \"tsc\",
       \"start\": \"node dist/main.js\",
       \"start:prod\": \"node dist/main.js\",
       \"migrate\": \"npm run typeorm migration:run\",
       \"typeorm\": \"typeorm-ts-node-commonjs\"
     },
     \"engines\": {
       \"node\": \">=18.0.0\"
     }
   }
   ```

### Step 2: Deploy to Railway

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Click \"New Project\" → \"Deploy from GitHub repo\"
   - Select your backend repository

2. **Add PostgreSQL Database**
   - In your Railway project, click \"+ New\"
   - Select \"Database\" → \"PostgreSQL\"
   - Railway will automatically provide connection details

3. **Configure Environment Variables**
   
   In Railway project settings, add these environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your-jwt-secret
   JWT_REFRESH_SECRET=your-refresh-secret
   FRONTEND_URL=https://your-frontend.vercel.app
   MAX_FILE_SIZE=5242880
   LOG_LEVEL=info
   ```

4. **Deploy Configuration**
   
   Create `railway.json` in your backend root:
   ```json
   {
     \"$schema\": \"https://railway.app/railway.schema.json\",
     \"build\": {
       \"builder\": \"NIXPACKS\",
       \"buildCommand\": \"npm run build\"
     },
     \"deploy\": {
       \"startCommand\": \"npm run migrate && npm run start:prod\",
       \"restartPolicyType\": \"ON_FAILURE\",
       \"restartPolicyMaxRetries\": 10
     }
   }
   ```

5. **Custom Domain (Optional)**
   - In Railway project settings, go to \"Domains\"
   - Add your custom domain
   - Configure DNS CNAME record

### Step 3: Database Migration

Railway will run migrations automatically with the start command, but you can also run them manually:

```bash
# From Railway CLI
railway run npm run migrate
```

## Backend Deployment (Render Alternative)

### Step 1: Prepare for Render

1. **Create render.yaml**
   
   Create `render.yaml` in your backend root:
   ```yaml
   services:
     - type: web
       name: mygrowvest-backend
       env: node
       plan: starter
       buildCommand: npm install && npm run build
       startCommand: npm run migrate && npm run start:prod
       envVars:
         - key: NODE_ENV
           value: production
         - key: JWT_SECRET
           generateValue: true
         - key: JWT_REFRESH_SECRET
           generateValue: true
         - key: DATABASE_URL
           fromDatabase:
             name: mygrowvest-db
             property: connectionString
   
   databases:
     - name: mygrowvest-db
       plan: starter
   ```

### Step 2: Deploy to Render

1. **Connect Repository**
   - Go to [Render](https://render.com)
   - Click \"New\" → \"Blueprint\"
   - Connect your GitHub repository
   - Select the repository with `render.yaml`

2. **Configure Environment Variables**
   
   Add these in Render dashboard:
   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   MAX_FILE_SIZE=5242880
   LOG_LEVEL=info
   ```

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. **Update Environment Variables**
   
   Create `.env.production` in frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   NEXT_PUBLIC_APP_URL=https://your-frontend.vercel.app
   NEXT_PUBLIC_SITE_NAME=MyGrowVest
   ```

2. **Update API Configuration**
   
   Update `src/lib/api.ts`:
   ```typescript
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
   ```

### Step 2: Deploy to Vercel

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Click \"New Project\"
   - Import your frontend repository

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Environment Variables**
   
   In Vercel project settings, add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   NEXT_PUBLIC_APP_URL=https://your-frontend.vercel.app
   ```

4. **Custom Domain (Optional)**
   - Go to project settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

## Docker Setup

### Backend Dockerfile

Create `Dockerfile` in backend directory:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

# Create uploads directory
RUN mkdir -p uploads && chown nestjs:nodejs uploads

# Switch to non-root user
USER nestjs

EXPOSE 8080

# Use dumb-init to handle signals properly
ENTRYPOINT [\"dumb-init\", \"--\"]
CMD [\"node\", \"dist/main.js\"]
```

### Frontend Dockerfile

Create `Dockerfile` in frontend directory:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT [\"dumb-init\", \"--\"]
CMD [\"npm\", \"start\"]
```

### Docker Compose for Local Development

Create `docker-compose.yml` in project root:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mygrowvest
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - \"5432:5432\"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - \"3001:8080\"
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/mygrowvest
      JWT_SECRET: dev-jwt-secret
      JWT_REFRESH_SECRET: dev-refresh-secret
      FRONTEND_URL: http://localhost:3000
    depends_on:
      - postgres
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - \"3000:3000\"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001/api
    depends_on:
      - backend

volumes:
  postgres_data:
```

## Environment Variables

### Backend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | development |
| `PORT` | Server port | No | 3001 |
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Yes | - |
| `JWT_EXPIRES_IN` | JWT expiration time | No | 1h |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | No | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | Yes | - |
| `MAX_FILE_SIZE` | Max upload file size (bytes) | No | 5242880 |
| `LOG_LEVEL` | Logging level | No | info |
| `RATE_LIMIT_MAX` | Rate limit max requests | No | 100 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | No | 900000 |

### Frontend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | - |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL | Yes | - |
| `NEXT_PUBLIC_SITE_NAME` | Site name | No | MyGrowVest |

## Database Setup

### Railway Database

1. **Automatic Setup**
   - Railway automatically creates and configures PostgreSQL
   - Connection details are provided as environment variables

2. **Manual Connection**
   ```bash
   # Connect to Railway database
   railway connect
   railway run psql $DATABASE_URL
   ```

### Render Database

1. **Automatic Setup**
   - Render creates PostgreSQL with the Blueprint
   - Connection string is automatically injected

2. **Manual Connection**
   ```bash
   # Get connection details from Render dashboard
   psql postgresql://username:password@host:port/database
   ```

### Database Migrations

Migrations run automatically on deployment, but you can run them manually:

```bash
# Railway
railway run npm run migrate

# Render (use their shell access)
npm run migrate

# Local Docker
docker-compose exec backend npm run migrate
```

## Domain Configuration

### Backend Domain (Railway)

1. **Add Custom Domain**
   - Railway Dashboard → Project → Settings → Domains
   - Add domain: `api.yourdomain.com`

2. **DNS Configuration**
   ```
   Type: CNAME
   Name: api
   Value: your-project.up.railway.app
   ```

### Backend Domain (Render)

1. **Add Custom Domain**
   - Render Dashboard → Service → Settings → Custom Domains
   - Add domain: `api.yourdomain.com`

2. **DNS Configuration**
   ```
   Type: CNAME
   Name: api
   Value: your-service.onrender.com
   ```

### Frontend Domain (Vercel)

1. **Add Custom Domain**
   - Vercel Dashboard → Project → Settings → Domains
   - Add domain: `yourdomain.com`

2. **DNS Configuration**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

## Monitoring & Logging

### Railway Monitoring

1. **Built-in Metrics**
   - CPU, Memory, Network usage
   - Request logs and errors
   - Database performance

2. **Custom Logging**
   ```typescript
   // Use the CustomLoggerService we created
   this.logger.logSystemEvent('deployment_health', { status: 'healthy' });
   ```

### Render Monitoring

1. **Built-in Metrics**
   - Service health checks
   - Resource usage
   - Deploy logs

2. **Health Checks**
   ```yaml
   # In render.yaml
   services:
     - type: web
       healthCheckPath: /health
   ```

### Vercel Analytics

1. **Enable Analytics**
   ```bash
   npm install @vercel/analytics
   ```

2. **Add to App**
   ```typescript
   // pages/_app.tsx
   import { Analytics } from '@vercel/analytics/react';
   
   export default function App({ Component, pageProps }) {
     return (
       <>
         <Component {...pageProps} />
         <Analytics />
       </>
     );
   }
   ```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   ```
   Solution: Ensure FRONTEND_URL is correctly set in backend
   Check: Network tab in browser dev tools
   ```

2. **Database Connection Issues**
   ```
   Solution: Verify DATABASE_URL format
   Check: Railway/Render database status
   Test: Railway CLI or Render shell access
   ```

3. **Build Failures**
   ```
   Solution: Check Node.js version compatibility
   Check: Package.json engines field
   Test: Local build with npm run build
   ```

4. **Environment Variables Not Loading**
   ```
   Solution: Verify variable names and deployment
   Check: Platform-specific environment variable format
   Test: Log environment variables on startup
   ```

### Debug Commands

```bash
# Railway debugging
railway logs
railway shell
railway status

# Render debugging
# Use dashboard shell access
# Check service logs in dashboard

# Vercel debugging
vercel logs
vercel inspect
```

### Health Check Endpoints

Use these endpoints to verify deployment:

```bash
# Backend health
curl https://your-backend.railway.app/health

# Detailed health
curl https://your-backend.railway.app/health/detailed

# Frontend health
curl https://your-frontend.vercel.app/api/health
```

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to version control
   - Use platform-specific secret management
   - Rotate JWT secrets regularly

2. **HTTPS**
   - Railway and Render provide HTTPS automatically
   - Vercel provides HTTPS automatically
   - Always use HTTPS URLs in production

3. **Database Security**
   - Use connection pooling
   - Enable SSL connections
   - Regular security updates

4. **Rate Limiting**
   - Configure appropriate limits
   - Monitor for abuse
   - Use CDN for static assets

## Performance Optimization

1. **Backend**
   - Enable compression
   - Use database indexing
   - Implement caching
   - Monitor memory usage

2. **Frontend**
   - Enable Next.js optimizations
   - Use image optimization
   - Implement service worker
   - Monitor Core Web Vitals

3. **Database**
   - Use connection pooling
   - Optimize queries
   - Regular maintenance
   - Monitor slow queries

This completes the comprehensive deployment guide for MyGrowVest. Follow these steps to deploy your application to production successfully."