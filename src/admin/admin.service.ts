import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Profile } from '../profile/interfaces/profile.interface';

@Injectable()
export class AdminService {

    constructor(@InjectModel('Profile') private readonly profileModel: Model<Profile>) {}

    async findAll(): Promise<Profile[]> {
        return await this.profileModel.find();
    }

    async findOne(id: string): Promise<Profile> {
        return await this.profileModel.findById(id);
    }

    async create(id: string, profile: Profile): Promise<Profile> {
        profile._id = id;
        const newAdmin = new this.profileModel(profile);
        return await newAdmin.save();
    }

    async delete(id: string): Promise<Profile> {
        return await this.profileModel.findByIdAndRemove(id);
    }

    async update(id: string, profile: Profile): Promise<Profile> {
        return await this.profileModel.findByIdAndUpdate(id, profile, { new: true });
    }
}
