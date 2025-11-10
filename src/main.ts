import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // افزایش محدودیت حجم body تا 10MB
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // cookie-parser
  app.use(cookieParser());

  // لاگ درخواست‌ها
  app.use((req, res, next) => {
    console.log(`🟡 ${req.method} ${req.originalUrl}`, req.body);
    next();
  });

  // فعال کردن CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'https://plannerify-next-test.liara.run'],
    credentials: true,
  });

  // این خط رو اضافه کن — همه روت‌ها با /api شروع می‌شن
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
