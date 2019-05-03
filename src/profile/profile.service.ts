import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Profile } from './interfaces/profile.interface';

@Injectable()
export class ProfileService {

    constructor(@InjectModel('Profile') private readonly profileModel: Model<Profile>) {}

    async findAll(): Promise<Profile[]> {
        return await this.profileModel.find();
    }

    async findOne(id: string): Promise<Profile> {
        return await this.profileModel.findOne(id);
    }

    async create(profile: Profile): Promise<Profile> {
        const newProfile = new this.profileModel(profile);
        return await newProfile.save();
    }

    async delete(id: string): Promise<Profile> {
        return await this.profileModel.findByIdAndRemove(id);
    }

    async update(id: string, profile: Profile): Promise<Profile> {
        return await this.profileModel.findByIdAndUpdate(id, profile, { new: true });
    }
}
