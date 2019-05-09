import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { AuthService } from './auth.service';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly reflector: Reflector, private authService: AuthService) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    return this.validateRoles(request, roles);
  }

  validateRoles(request: Request, roles: string[]): boolean | Promise<boolean> {
    if (!roles) {
      return true;
    }

    return new Promise((resolve) => {
      // Try to validate the roles
      try {
        const token = this.authService.decodeJwt(request);
        const cognitoRoles = token['cognito:groups'];
        const hasRole = () => cognitoRoles.some((role) => roles.includes(role));
        if (cognitoRoles && hasRole()) {
          resolve(true);
        }
        resolve(false);
      } catch (error) {
        // If token is not valid, respond with 401 (unauthorized)
        resolve(false);
      }
    });
  }
}
