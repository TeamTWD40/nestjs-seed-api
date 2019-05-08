import { HttpModule, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Profile } from './interfaces/profile.interface';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

describe('News Controller', () => {
  let controller: ProfileController;
  let profileService: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ProfileService, Logger],
      controllers: [ProfileController],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all user profiles', async () => {
      const result: Profile = {
        _id: '1',
        first: 'john',
        last: 'doe',
        email: 'jdoe@foo.bar',
      };

      jest.spyOn(profileService, 'findOne').mockImplementation(() => new Promise(resolve => resolve(result)));

      controller.findOne(null).then(response => {
        expect(response).toBe(result);
      });
    });
  });
});
