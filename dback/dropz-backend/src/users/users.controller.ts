import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('search')
    async search(@Query('q') query: string) {
        return await this.usersService.search(query);
    }

    @Post('create')
    async createUser(@Body() body: { wallet: string; email?: string }) {
        return await this.usersService.createUser(body.wallet, body.email);
    }

    @Get(':wallet')
    async getUser(@Param('wallet') wallet: string) {
        return await this.usersService.getUserByWallet(wallet);
    }

    @Get()
    async getAllUsers() {
        return await this.usersService.getAllUsers();
    }
}
