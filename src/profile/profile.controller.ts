import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { Roles } from '../auth/roles.decorator';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './interfaces/profile.interface';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {

    constructor(private authService: AuthService, private readonly profileService: ProfileService) {}

    @Get()
    @Roles('users')
    findOne(@Req() req: Request): Promise<Profile> {
        const id = this.authService.getUsernameFromJwt(req);
        return this.profileService.findOne(id);
    }

    @Post()
    @Roles('users')
    create(@Req() req: Request, @Body() profileDto: CreateProfileDto): Promise<Profile> {
        const id = this.authService.getUsernameFromJwt(req);
        return this.profileService.create(id, profileDto as Profile);
    }

    @Delete()
    @Roles('users')
    delete(@Req() req: Request): Promise<Profile> {
        const id = this.authService.getUsernameFromJwt(req);
        return this.profileService.delete(id);
    }

    @Put()
    @Roles('users')
    update(@Req() req: Request, @Body() profile: CreateProfileDto): Promise<Profile> {
        const id = this.authService.getUsernameFromJwt(req);
        return this.profileService.update(id, profile as Profile);
    }
}
