import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  get(): string {
    return 'Nothing to see here, move along.';
  }
  getVersion(): string {
    return 'v1';
  }
}
