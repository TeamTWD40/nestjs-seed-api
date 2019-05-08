import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './interfaces/profile.interface';
import { ProfileService } from './profile.service';

@Controller('profile')
@ApiBearerAuth()
@Roles('users')
@UseGuards(AuthGuard, RolesGuard)
export class ProfileController {

    constructor(private authService: AuthService, private readonly profileService: ProfileService) {}

    @Get()
    findOne(@Req() req: Request): Promise<Profile> {
        const id = this.authService.getUsernameFromJwt(req);
        return this.profileService.findOne(id);
    }

    @Post()
    create(@Req() req: Request, @Body() profileDto: CreateProfileDto): Promise<Profile> {
        const id = this.authService.getUsernameFromJwt(req);
        return this.profileService.create(id, profileDto as Profile);
    }

    @Delete()
    delete(@Req() req: Request): Promise<Profile> {
        const id = this.authService.getUsernameFromJwt(req);
        return this.profileService.delete(id);
    }

    @Put()
    update(@Req() req: Request, @Body() profile: CreateProfileDto): Promise<Profile> {
        const id = this.authService.getUsernameFromJwt(req);
        return this.profileService.update(id, profile as Profile);
    }
}
