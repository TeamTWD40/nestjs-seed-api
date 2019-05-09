import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { AdminService } from './admin/admin.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { RolesGuard } from './auth/roles.guard';
import config from './config/keys';
import { ProfileController } from './profile/profile.controller';
import { ProfileModule } from './profile/profile.module';
import { ProfileService } from './profile/profile.service';
import { KafkaController } from './kafka/kafka.controller';
import { ExampleKafkaService } from './shared/kafka/example-kafka.service';

@Module({
  imports: [
    AdminModule,
    ProfileModule,
    MongooseModule.forRoot(config.mongoURI, { useNewUrlParser: true }),
  ],
  controllers: [AppController, AdminController, ProfileController, KafkaController],
  providers: [
    AppService,
    AdminService,
    ProfileService,
    ExampleKafkaService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
