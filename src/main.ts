import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['debug', 'error', 'verbose', 'warn'],
    bodyParser: true,
    cors: true
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/upload' });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false, whitelist: true, transform: true}));
  // app.useStaticAssets(join(__dirname, '..', 'public'), {prefix: '/public'});

  const config = new DocumentBuilder()
    .setTitle('SoftApp')
    .setDescription('The SoftApp API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // render
  await app.listen(5000, () => console.log("🚀Listen on port 5000 🚀"));
}
bootstrap();
