import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    ) { }

    async create(data: Partial<Transaction>): Promise<Transaction> {
        const newTransaction = new this.transactionModel(data);
        return newTransaction.save();
    }

    async findAllByWallet(wallet: string): Promise<Transaction[]> {
        return this.transactionModel
            .find({ wallet })
            .sort({ createdAt: -1 })
            .limit(10)
            .exec();
    }
}
