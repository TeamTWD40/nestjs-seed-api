import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';
import { ProfileModule } from '../../src/profile/profile.module';

describe('ProfileController (e2e)', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ProfileModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/profile (GET)', () => {
    return request(app.getHttpServer())
      .get('/profile')
      .expect(403);
    //   .expect('Hello World!');
  });
});
