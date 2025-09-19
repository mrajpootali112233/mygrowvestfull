# MyGrowVest Vercel Deployment Script
# Run this script to deploy both frontend and backend to Vercel

Write-Host \"🚀 Starting MyGrowVest Vercel Deployment...\" -ForegroundColor Green

# Check if Vercel CLI is installed
if (!(Get-Command \"vercel\" -ErrorAction SilentlyContinue)) {
    Write-Host \"❌ Vercel CLI not found. Installing...\" -ForegroundColor Red
    npm install -g vercel
}

# Login to Vercel
Write-Host \"🔐 Please login to Vercel...\" -ForegroundColor Yellow
vercel login

# Deploy Backend
Write-Host \"📦 Deploying Backend...\" -ForegroundColor Blue
Set-Location backend
vercel --prod
$backendUrl = Read-Host \"Enter the deployed backend URL (e.g., https://mygrowvest-backend.vercel.app)\"
Set-Location ..

# Update Frontend Environment
Write-Host \"🔧 Updating Frontend Environment...\" -ForegroundColor Yellow
$frontendEnv = @\"
NEXT_PUBLIC_API_URL=$backendUrl/api
NEXT_PUBLIC_APP_URL=https://mygrowvest-frontend.vercel.app
NEXT_PUBLIC_BINANCE_DEPOSIT_ID=941704599
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
\"@
$frontendEnv | Out-File -FilePath \"frontend\\.env.production\" -Encoding UTF8

# Deploy Frontend
Write-Host \"🎨 Deploying Frontend...\" -ForegroundColor Blue
Set-Location frontend
vercel --prod
Set-Location ..

Write-Host \"✅ Deployment Complete!\" -ForegroundColor Green
Write-Host \"📋 Next Steps:\" -ForegroundColor Yellow
Write-Host \"1. Update backend FRONTEND_URL environment variable\" -ForegroundColor White
Write-Host \"2. Configure your database (PostgreSQL recommended)\" -ForegroundColor White
Write-Host \"3. Test all functionality\" -ForegroundColor White
Write-Host \"4. Set up custom domains (optional)\" -ForegroundColor White

Read-Host \"Press Enter to continue...\"