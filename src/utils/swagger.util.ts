import { ConsoleLogger, INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

const env = process.env;

/**
 * 
 * @param {INestApplication} app
 */

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle(`${env.NAME}`)
    .setDescription(`${env.DESC}`)
    .setVersion(`${env.VER}`)
    .addTag(`${env.TAG}`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  console.log(`${env.SWAGGER_URI}`)
  SwaggerModule.setup(`${env.SWAGGER_URI}`, app, document);
}