import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async createUser(wallet: string, email?: string) {
        const existingUser = await this.userModel.findOne({ wallet });
        if (existingUser) {
            throw new Error('User already exists');
        }
        const newUser = new this.userModel({
            wallet,
            email,
            createdAt: new Date(),
        });
        return await newUser.save();
    }

    async getUserByWallet(wallet: string) {
        return await this.userModel.findOne({ wallet });
    }

    async getAllUsers() {
        return await this.userModel.find();
    }

    async search(query: string) {
        return this.userModel.find({
            $or: [
                { email: { $regex: query, $options: 'i' } },
                { wallet: { $regex: query, $options: 'i' } }
            ]
        }).exec();
    }
}
