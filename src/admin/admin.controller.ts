import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { Profile } from 'src/profile/interfaces/profile.interface';

import { AdminService } from './admin.service';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {

    constructor(private adminService: AdminService) {}

    @Get('profiles')
    @Roles('admin')
    findAll(): Promise<Profile[]> {
        return this.adminService.findAll();
    }

    @Get('profiles:id')
    @Roles('admin')
    findOne(@Param('id') id): Promise<Profile> {
        return this.adminService.findOne(id);
    }

    @Post('profiles:id')
    @Roles('admin')
    create(@Param('id') id, @Body() profileDto: CreateProfileDto): Promise<Profile> {
        return this.adminService.create(id, profileDto as Profile);
    }

    @Delete('profiles:id')
    @Roles('admin')
    delete(@Param('id') id): Promise<Profile> {
        return this.adminService.delete(id);
    }

    @Put('profiles:id')
    @Roles('admin')
    update(@Param('id') id, @Body() profile: CreateProfileDto): Promise<Profile> {
        return this.adminService.update(id, profile as Profile);
    }
}
