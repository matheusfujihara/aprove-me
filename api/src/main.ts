import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 3001
  await app.listen(PORT).then(() => logger.log(`server running on port ${PORT}`));
}
bootstrap();
