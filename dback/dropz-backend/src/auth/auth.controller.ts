import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // ===== SEED PHRASE ENDPOINTS =====

    @Post('seed/generate')
    async generateSeed() {
        return await this.authService.createSeedWallet();
    }

    @Post('seed/import')
    async importSeed(@Body() body: { seedPhrase: string }) {
        if (!body.seedPhrase) {
            throw new BadRequestException('Seed phrase is required');
        }
        return await this.authService.importSeedWallet(body.seedPhrase);
    }

    @Post('seed/register')
    async registerSeed(@Body() body: { wallet: string; seedPhrase: string }) {
        if (!body.wallet || !body.seedPhrase) {
            throw new BadRequestException('Wallet and seed phrase are required');
        }
        try {
            return await this.authService.registerSeed(body.wallet, body.seedPhrase);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // ===== EMAIL ENDPOINTS =====

    @Post('email/register')
    async registerEmail(@Body() body: { email: string; password: string }) {
        if (!body.email || !body.password) {
            throw new BadRequestException('Email and password are required');
        }
        try {
            return await this.authService.registerEmail(body.email, body.password);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post('email/login')
    async loginEmail(@Body() body: { email: string; password: string }) {
        if (!body.email || !body.password) {
            throw new BadRequestException('Email and password are required');
        }
        try {
            return await this.authService.loginEmail(body.email, body.password);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
