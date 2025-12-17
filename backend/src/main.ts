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
  )
   // Enable CORS for your frontend (adjust the origin as needed)
  app.enableCors({
    origin: [
    'http://localhost:5173',
    "https://hospital-system-38t29e60i-shady-ahmeds-projects.vercel.app", // later
  ], // Your Vite dev server
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
