import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Profile } from 'src/profile/interfaces/profile.interface';

import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;
  const profileModel: Model<Profile> = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getModelToken('Profile'),
          useValue: profileModel,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
