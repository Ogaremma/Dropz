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

    // Generate a new random seed phrase and wallet
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
            seedPhrase, // Show to user once
            privateKey, // Optional: show to user once
        };
    }

    // Import existing seed phrase
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

    // Register or Login user with seed phrase
    async registerSeed(wallet: string, seedPhrase: string) {
        let user = await this.userModel.findOne({ wallet });

        if (!user) {
            user = new this.userModel({
                wallet,
                seedPhrase, // Store seed (consider encrypting in production)
                loginType: 'seed',
                createdAt: new Date(),
            });
            await user.save();
        }

        // Generate JWT token
        const token = this.jwtService.sign({ wallet, userId: user._id });

        return {
            user,
            token,
        };
    }

    // ===== EMAIL AUTH =====

    // Register user with email + password
    async registerEmail(email: string, password: string) {
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Generate a wallet address for this user
        const tempWallet = ethers.Wallet.createRandom().address;

        const newUser = new this.userModel({
            wallet: tempWallet,
            email,
            passwordHash,
            loginType: 'email',
            createdAt: new Date(),
        });

        const savedUser = await newUser.save();

        // Generate JWT token
        const token = this.jwtService.sign({ wallet: tempWallet, userId: savedUser._id });

        return {
            user: savedUser,
            token,
        };
    }

    // Login with email + password
    async loginEmail(email: string, password: string) {
        const user = await this.userModel.findOne({ email });

        if (!user) {
            throw new Error('Email not found');
        }

        if (!user.passwordHash) {
            throw new Error('Password not set for this account');
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        // Generate JWT token
        const token = this.jwtService.sign({ wallet: user.wallet, userId: user._id });

        return {
            user,
            token,
        };
    }

    // ===== GENERAL =====

    // Verify JWT token
    verifyToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}
