import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'verbose', 'warn'],
    bodyParser: true,
    cors: true,
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      whitelist: true,
      transform: true,
    }),
  );

  // render
  await app.listen(5000, () => console.log('🚀Listen on port 5000 🚀'));
}
bootstrap();
