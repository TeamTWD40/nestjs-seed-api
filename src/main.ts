import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AdminModule } from './admin/admin.module';
import { AppModule } from './app.module';
import { ProfileModule } from './profile/profile.module';
import { KafkaClient, Producer } from 'kafka-node';

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

  SwaggerModule.setup('/docs', app, swaggerDoc, {
    swaggerUrl: `/docs-json`,
    explorer: true,
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  // Kafka
  // const client = new KafkaClient({kafkaHost: 'localhost:2181'});
  // const producer = new Producer(client);
  // const payloads = [
  //     { topic: 'topic1', messages: 'hi', partition: 0 },
  // ];

  // producer.on('ready', () => {
  //     console.log('ready');
  //     producer.send(payloads, (err, data) => {
  //         console.log(data);
  //         this.logResponse(data);
  //     });
  // });

  // producer.on('error', (error) => {
  //     console.log(error);
  // });

  // app.setGlobalPrefix('');

  await app.listen(8081);
}
bootstrap();
