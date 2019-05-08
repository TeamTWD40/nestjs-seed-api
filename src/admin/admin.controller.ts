import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AdminService } from '../admin/admin.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateProfileDto } from '../profile/dto/create-profile.dto';
import { Profile } from '../profile/interfaces/profile.interface';

@Controller('admin')
@ApiBearerAuth()
@Roles('admin')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {

    constructor(private adminService: AdminService) {}

    @Get('profiles')
    findAll(): Promise<Profile[]> {
        return this.adminService.findAll();
    }

    @Get('profiles:id')
    findOne(@Param('id') id): Promise<Profile> {
        return this.adminService.findOne(id);
    }

    @Post('profiles:id')
    create(@Param('id') id, @Body() profileDto: CreateProfileDto): Promise<Profile> {
        return this.adminService.create(id, profileDto as Profile);
    }

    @Delete('profiles:id')
    delete(@Param('id') id): Promise<Profile> {
        return this.adminService.delete(id);
    }

    @Put('profiles:id')
    update(@Param('id') id, @Body() profile: CreateProfileDto): Promise<Profile> {
        return this.adminService.update(id, profile as Profile);
    }
}
