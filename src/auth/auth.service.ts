import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as JWT from 'jwt-decode';

@Injectable()
export class AuthService {
  decodeJwt(request: Request): any {
    const token = request.headers.authorization.split(' ')[1];
    return JWT(token);
  }
  getUsernameFromJwt(request: Request): any {
    const token = request.headers.authorization.split(' ')[1];
    return JWT(token)['cognito:username'];
  }
}
