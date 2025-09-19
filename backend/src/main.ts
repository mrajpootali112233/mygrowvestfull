import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

// For Vercel serverless deployment
const expressApp = express();

async function createNestApp() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  // CORS configuration for production
  app.enableCors({
    origin: [
      configService.get('FRONTEND_URL', 'http://localhost:3001'),
      'https://mygrowvest-frontend.vercel.app',
      'https://mygrowvest.vercel.app',
      /\.vercel\.app$/,
      'http://localhost:3000',
      'http://localhost:3001'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global prefix
  app.setGlobalPrefix('api');

  await app.init();
  logger.log('NestJS application initialized for Vercel');
  return app;
}

// For local development
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const logger = new Logger('Bootstrap');

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
      }),
    );

    // CORS configuration
    app.enableCors({
      origin: configService.get('FRONTEND_URL', 'http://localhost:3001'),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global prefix
    app.setGlobalPrefix('api');

    const port = configService.get('PORT', 3000);
    
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(`Environment: ${configService.get('NODE_ENV', 'development')}`);
  }
}

// Export for Vercel
let cachedApp: any;

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    cachedApp = await createNestApp();
  }
  return cachedApp.getHttpAdapter().getInstance()(req, res);
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}