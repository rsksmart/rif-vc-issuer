import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DEFAULT_VERSION } from './constants';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: DEFAULT_VERSION,
  });


  const config = new DocumentBuilder()
    .setTitle('RIF VC Issuer')
    .setDescription('Service that allows to register and validate service providers within the RIF Gateway')
    .setVersion('1.0')
    .build();

  const swaggerOptions: SwaggerDocumentOptions = {
    deepScanRoutes: true
  };

  const document = SwaggerModule.createDocument(app, config, swaggerOptions);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
