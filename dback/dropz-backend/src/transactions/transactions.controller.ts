import { Controller, Get, Query, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Get(':wallet')
    async getByWallet(@Param('wallet') wallet: string) {
        return this.transactionsService.findAllByWallet(wallet);
    }
}
