// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     })
//   )
//    // Enable CORS for your frontend (adjust the origin as needed)
//   app.enableCors({
//     origin: [
//     'http://localhost:5173',
//     "https://hospital-system-38t29e60i-shady-ahmeds-projects.vercel.app", // later
//   ], // Your Vite dev server
//     credentials: true,
//   });
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // ✅ FIXED CORS CONFIGURATION
  app.enableCors({
    origin: [
      'http://localhost:5173', // Local development
      'https://hospital-system-khaki.vercel.app', // Your CURRENT Vercel domain
      'https://hospital-system-38t29e60i-shady-ahmeds-projects.vercel.app', // Your other Vercel domain
      'https://hospital-system-*.vercel.app', // Wildcard for all Vercel previews
      /\.vercel\.app$/, // Regex for ALL Vercel domains
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
  });

  // Handle preflight requests globally
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
      res.status(200).end();
      return;
    }
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server running on port ${process.env.PORT ?? 3000}`);
}

bootstrap();