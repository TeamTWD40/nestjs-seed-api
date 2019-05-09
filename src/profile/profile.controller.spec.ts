import { HttpModule } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { Profile } from './interfaces/profile.interface';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthService } from '../auth/auth.service';

describe('ProfileController', () => {
  let controller: ProfileController;
  let profileService: ProfileService;
  let authService: AuthService;
  const profileModel: Model<Profile> = {};
  const result: Profile = {
    _id: '1',
    first: 'john',
    last: 'doe',
    email: 'jdoe@foo.bar',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        AuthService,
        ProfileService,
        {
          provide: getModelToken('Profile'),
          useValue: profileModel,
        },
      ],
      controllers: [ProfileController],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get<ProfileService>(ProfileService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user profile', async () => {
      jest
        .spyOn(authService, 'getUsernameFromJwt')
        .mockImplementation(() => new Promise(resolve => resolve('1')));
      jest
        .spyOn(profileService, 'findOne')
        .mockImplementation(() => new Promise(resolve => resolve(result)));

      controller.findOne(null).then(response => {
        expect(response).toBe(result);
      });
    });
  });

  describe('create', () => {
    it('should create and return a user profile', async () => {
      jest
        .spyOn(authService, 'getUsernameFromJwt')
        .mockImplementation(() => new Promise(resolve => resolve('1')));
      jest
        .spyOn(profileService, 'create')
        .mockImplementation(() => new Promise(resolve => resolve(result)));

      controller.create(null, null).then(response => {
        expect(response).toBe(result);
      });
    });
  });

  describe('delete', () => {
    it('should delete profile and return deleted profile', async () => {
      jest
        .spyOn(authService, 'getUsernameFromJwt')
        .mockImplementation(() => new Promise(resolve => resolve('1')));
      jest
        .spyOn(profileService, 'delete')
        .mockImplementation(() => new Promise(resolve => resolve(result)));

      controller.delete(null).then(response => {
        expect(response).toBe(result);
      });
    });
  });

  describe('update', () => {
    it('should update user profile', async () => {
      jest
        .spyOn(authService, 'getUsernameFromJwt')
        .mockImplementation(() => new Promise(resolve => resolve('1')));
      jest
        .spyOn(profileService, 'update')
        .mockImplementation(() => new Promise(resolve => resolve(result)));

      controller.update(null, null).then(response => {
        expect(response).toBe(result);
      });
    });
  });
});
