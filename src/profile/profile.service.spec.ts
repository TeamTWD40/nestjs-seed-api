import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { Profile } from './interfaces/profile.interface';
import { ProfileService } from './profile.service';
import { ProfileSchema } from './schemas/profile.schema';

describe('ProfileService', () => {
  let service: ProfileService;
  let profileModel: Model<Profile>;
  const token = getModelToken(ProfileSchema);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: token,
          useFactory: async connection => connection.model('Profile', ProfileSchema),
          inject: ['DbConnectionToken'],
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    profileModel = module.get(token);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
