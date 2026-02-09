import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './schemas/transaction.schema';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Post()
    async create(@Body() data: Partial<Transaction>) {
        return this.transactionsService.create(data);
    }

    @Get(':wallet')
    async getByWallet(@Param('wallet') wallet: string) {
        return this.transactionsService.findAllByWallet(wallet);
    }
}
