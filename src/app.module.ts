import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { ProfileModule } from './profile/profile.module';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config/keys';

@Module({
  imports: [ProfileModule, MongooseModule.forRoot(config.mongoURI)],
  controllers: [AppController, ProfileController],
  providers: [AppService, ProfileService]
})
export class AppModule {}
