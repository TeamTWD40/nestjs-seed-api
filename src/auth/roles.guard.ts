import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const response = context.switchToHttp().getResponse();
    const cognitoRoles = response.locals.user["cognito:groups"]
    console.log(cognitoRoles);
    const hasRole = () => cognitoRoles.some((role) => roles.includes(role));
    return cognitoRoles && hasRole();
  }
}