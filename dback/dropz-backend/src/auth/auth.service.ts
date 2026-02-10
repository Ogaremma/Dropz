import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { ethers } from 'ethers';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
    ) { }

    // ===== SEED PHRASE AUTH =====


    async createSeedWallet() {
        const wallet = ethers.Wallet.createRandom();
        const mnemonic = wallet.mnemonic;
        if (!mnemonic) {
            throw new Error('Failed to generate seed phrase');
        }
        const seedPhrase = mnemonic.phrase;
        const address = wallet.address;
        const privateKey = wallet.privateKey;

        return {
            address,
            seedPhrase,
            privateKey,
        };
    }


    async importSeedWallet(seedPhrase: string) {
        try {
            const wallet = ethers.Wallet.fromPhrase(seedPhrase);
            return {
                address: wallet.address,
                privateKey: wallet.privateKey,
            };
        } catch (error) {
            throw new Error('Invalid seed phrase');
        }
    }


    async registerSeed(wallet: string, seedPhrase: string) {
        const normalizedWallet = wallet.toLowerCase();
        let user = await this.userModel.findOne({ wallet: normalizedWallet });

        if (!user) {
            user = new this.userModel({
                wallet: normalizedWallet,
                seedPhrase,
                loginType: 'seed',
                createdAt: new Date(),
            });
            await user.save();
        }


        const token = this.jwtService.sign({ wallet: normalizedWallet, userId: user._id });

        return {
            user,
            token,
        };
    }

    // ===== EMAIL AUTH =====


    async registerEmail(email: string, password: string) {
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new Error('Email already registered');
        }


        const passwordHash = await bcrypt.hash(password, 10);


        const tempWallet = ethers.Wallet.createRandom().address;

        const newUser = new this.userModel({
            wallet: tempWallet,
            email,
            passwordHash,
            loginType: 'email',
            createdAt: new Date(),
        });

        const savedUser = await newUser.save();


        const token = this.jwtService.sign({ wallet: tempWallet, userId: savedUser._id });

        return {
            user: savedUser,
            token,
        };
    }


    async loginEmail(email: string, password: string) {
        const user = await this.userModel.findOne({ email });

        if (!user) {
            throw new Error('Email not found');
        }

        if (!user.passwordHash) {
            throw new Error('Password not set for this account');
        }


        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }


        const token = this.jwtService.sign({ wallet: user.wallet, userId: user._id });

        return {
            user,
            token,
        };
    }

    // ===== GENERAL =====


    verifyToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }


    async updateProfile(wallet: string, data: Partial<User>) {
        const normalizedWallet = wallet.toLowerCase();
        const user = await this.userModel.findOne({ wallet: normalizedWallet });
        if (!user) {
            throw new Error('User not found');
        }

        if (data.username !== undefined) user.username = data.username;
        if (data.bio !== undefined) user.bio = data.bio;
        if (data.avatarUrl !== undefined) user.avatarUrl = data.avatarUrl;

        return await user.save();
    }
}
