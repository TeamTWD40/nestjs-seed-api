import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from '../auth/auth.service';
import { ProfileSchema } from '../profile/schemas/profile.schema';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }])],
  controllers: [AdminController],
  providers: [AdminService, AuthService],
})
export class AdminModule {}
