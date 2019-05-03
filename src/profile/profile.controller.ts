import { Controller, Get, Post, Body, Delete, Param, Put, UseGuards } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';
import { Profile } from './interfaces/profile.interface';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('profile')
export class ProfileController {

    constructor(private  readonly profileService: ProfileService) {}

    @Get()
    @UseGuards(AuthGuard)
    // @Roles('admin')
    findAll(): Promise<Profile[]> {
        return this.profileService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    findOne(@Param('id') id): Promise<Profile> {
        return this.profileService.findOne(id);
    }

    @Post()
    create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
        return this.profileService.create(createProfileDto);
    }

    @Delete(':id')
    delete(@Param('id') id): Promise<Profile> {
        return this.profileService.delete(id);
    }

    @Put(':id')
    update(@Body() profile: CreateProfileDto, @Param('id') id): Promise<Profile> {
        return this.profileService.update(id, profile);
    }
}
