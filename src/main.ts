import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { linkToDatabase } from './utils/db.util';
import { setupSwagger } from './utils/swagger.util';
import { config } from 'dotenv';
import helmet from 'helmet';
config();


const env = process.env;
const logger = new Logger('NXP-backend');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useLogger(winstonLogger);
  app.setGlobalPrefix(env.GLOBAL_PREFIX);
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
    exposedHeaders: ["Authorization"]
  });

  app.use(helmet({
    contentSecurityPolicy: false
  }));
  
  await linkToDatabase();
  if (env.MODE == "DEV") {
    try {
      setupSwagger(app);
      logger.log("Swagger is enabled");
    } catch (e) {
      logger.error(e);
    }
  }
  await app.listen(env.PORT || 3000).then(() => {
    console.log(`App is running on Port ${env.PORT || 3000}`)
  }).catch((e) => {
    console.error(e)
  });
}

bootstrap();
