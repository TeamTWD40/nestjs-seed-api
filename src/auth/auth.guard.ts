import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as CognitoExpress from 'cognito-express';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

import config from '../config/keys';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        return this.validateJwt(request, response);
    }

    validateJwt(req: Request, res: Response): Promise<boolean> {
        // Get the jwt token from the head
        // Initializing CognitoExpress constructor
        const cognitoExpress = new CognitoExpress(config.cognitoConfig);

        let accessTokenFromClient = null;
        if (
            req.headers.authorization &&
            req.headers.authorization.indexOf(' ') !== -1
        ) {
            accessTokenFromClient = req.headers.authorization.split(' ')[1];
        }

        return new Promise((resolve) => {
            // Try to validate the token and get data
            try {
                cognitoExpress.validate(accessTokenFromClient, (err, response) => {
                    if (err) { resolve(false); }
                    resolve(true);
                });
            } catch (error) {
                // If token is not valid, respond with 401 (unauthorized)
                resolve(false);
            }
        });
    }
}
