import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './utils/logger/logger.util';
import { setupSwagger } from './utils/swagger-util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger: winstonLogger
  });
  setupSwagger(app);
  app.enableCors();
  await app.listen(process.env.PORT);
}
bootstrap();
