import { Test, TestingModule } from '@nestjs/testing';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  const request: any = {
    headers: {
      authorization:
          // tslint:disable-next-line:max-line-length
        'Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhYWFhYWFhYS1iYmJiLWNjY2MtZGRkZC1lZWVlZWVlZWVlZWUiLCJhdWQiOiJ4eHh4eHh4eHh4eHhleGFtcGxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTAwMDA5NDAwLCJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL3VzLWVhc3QtMV9leGFtcGxlIiwiY29nbml0bzp1c2VybmFtZSI6ImphbmVkb2UiLCJleHAiOjE1MDAwMTMwMDAsImdpdmVuX25hbWUiOiJKYW5lIiwiaWF0IjoxNTAwMDA5NDAwLCJlbWFpbCI6ImphbmVkb2VAZXhhbXBsZS5jb20ifQ.GHMyjjWRc_Fal1g_D05TGW3ZUP80rV6b-Lj2Hpz0NCk',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthGuard],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should validate jwt token', () => {
    guard.validateJwt(request, null).then(response => {
      expect(response).toBeDefined();
    });
  });

});
