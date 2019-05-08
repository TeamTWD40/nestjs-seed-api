import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Profile } from '../profile/interfaces/profile.interface';

@Injectable()
export class AdminService {

    constructor(@InjectModel('Admin') private readonly AdminModel: Model<Profile>) {}

    async findAll(): Promise<Profile[]> {
        return await this.AdminModel.find();
    }

    async findOne(id: string): Promise<Profile> {
        return await this.AdminModel.findById(id);
    }

    async create(id: string, Admin: Profile): Promise<Profile> {
        Admin._id = id;
        const newAdmin = new this.AdminModel(Admin);
        return await newAdmin.save();
    }

    async delete(id: string): Promise<Profile> {
        return await this.AdminModel.findByIdAndRemove(id);
    }

    async update(id: string, Admin: Profile): Promise<Profile> {
        return await this.AdminModel.findByIdAndUpdate(id, Admin, { new: true });
    }
}
