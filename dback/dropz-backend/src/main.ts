import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || 3000;

  await app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Backend is listening on port ${port} and binding to 0.0.0.0`);
  });
}
bootstrap();
