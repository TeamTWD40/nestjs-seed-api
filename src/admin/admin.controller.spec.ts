import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Profile } from 'src/profile/interfaces/profile.interface';

import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { RolesGuard } from '../auth/roles.guard';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('Admin Controller', () => {
  let controller: AdminController;
  let adminService: AdminService;
  let authService: AuthService;
  const profileModel: Model<Profile> = {};

  const result: Profile = {
    _id: '1',
    first: 'john',
    last: 'doe',
    email: 'jdoe@foo.bar',
  };

  const resultArray = [result];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        AdminService,
        AuthService,
        {
          provide: getModelToken('Profile'),
          useValue: profileModel,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    adminService = module.get<AdminService>(AdminService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all user profiles', async () => {
      jest
        .spyOn(adminService, 'findAll')
        .mockImplementation(() => new Promise(resolve => resolve(resultArray)));

      controller.findAll().then(response => {
        expect(response).toBe(resultArray);
      });
    });
  });

  describe('findOne', () => {
    it('should return a user profile', async () => {
      jest
        .spyOn(authService, 'getUsernameFromJwt')
        .mockImplementation(() => new Promise(resolve => resolve('1')));
      jest
        .spyOn(adminService, 'findOne')
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
        .spyOn(adminService, 'create')
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
        .spyOn(adminService, 'delete')
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
        .spyOn(adminService, 'update')
        .mockImplementation(() => new Promise(resolve => resolve(result)));

      controller.update(null, null).then(response => {
        expect(response).toBe(result);
      });
    });
  });
});
