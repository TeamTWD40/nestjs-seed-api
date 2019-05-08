import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AdminModule } from './admin/admin.module';
import { AppModule } from './app.module';
import { ProfileModule } from './profile/profile.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('User Profile')
    .setDescription('API for managing user profiles from AWS Cognito JWT Token')
    .setVersion('1.0')
    .setBasePath('/api')
    .addBearerAuth('Authorization', 'header')
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, options, { include: [AdminModule, ProfileModule] });

  SwaggerModule.setup('/api/docs', app, swaggerDoc, {
    // swaggerUrl: `${hostDomain}/api/docs-json`,
    swaggerUrl: `http://localhost:9000/api/docs-json`,
    explorer: true,
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
