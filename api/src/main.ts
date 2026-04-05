import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('integrations');

  const config = new DocumentBuilder()
    .setTitle('Bankme API')
    .setDescription('Bankme API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  const PORT = process.env.PORT!;
  await app
    .listen(PORT)
    .then(() => logger.log(`server running on port ${PORT}`));
}
bootstrap();
