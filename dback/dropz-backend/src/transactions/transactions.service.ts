import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
        private configService: ConfigService,
    ) { }

    async create(data: Partial<Transaction>): Promise<Transaction> {
        const newTransaction = new this.transactionModel(data);
        return newTransaction.save();
    }

    async findAllByWallet(wallet: string): Promise<Transaction[]> {
        return this.transactionModel
            .find({ wallet: wallet.toLowerCase() })
            .sort({ createdAt: -1 })
            .limit(10)
            .exec();
    }

    async syncWithBlockchain(wallet: string) {
        const rpcUrl = this.configService.get<string>('RPC_URL');
        if (!rpcUrl) return { success: false, error: 'RPC_URL not configured' };

        try {
            const ethers = require('ethers');
            const provider = new ethers.JsonRpcProvider(rpcUrl);

            const currentBlock = await provider.getBlockNumber();

            const fromBlock = Math.max(0, currentBlock - 10000);

            const txCount = await provider.getTransactionCount(wallet);

            if (txCount === 0) {
                return { success: true, count: 0, message: 'No transactions found' };
            }

            let foundTransactions = 0;
            const batchSize = 100;

            for (let i = currentBlock; i >= fromBlock; i -= batchSize) {
                const startBlock = Math.max(fromBlock, i - batchSize + 1);
                const endBlock = i;

                try {
                    for (let blockNum = startBlock; blockNum <= endBlock; blockNum++) {
                        const block = await provider.getBlock(blockNum, true);

                        if (!block || !block.transactions) continue;

                        for (const tx of block.transactions) {
                            if (typeof tx === 'string') continue;

                            if (tx.to && tx.to.toLowerCase() === wallet.toLowerCase()) {
                                const existing = await this.transactionModel.findOne({
                                    transactionHash: tx.hash
                                });

                                if (!existing) {
                                    const valueInEth = ethers.formatEther(tx.value || '0');

                                    await this.create({
                                        wallet: wallet.toLowerCase(),
                                        type: 'DEPOSIT',
                                        amount: valueInEth,
                                        transactionHash: tx.hash,
                                        status: 'CONFIRMED',
                                        tokenName: 'ETH'
                                    });

                                    foundTransactions++;
                                }
                            }
                        }
                    }
                } catch (blockError) {
                    console.error(`Error scanning blocks ${startBlock}-${endBlock}:`, blockError);
                }
            }

            return {
                success: true,
                count: foundTransactions,
                message: `Scanned blocks ${fromBlock} to ${currentBlock}`
            };
        } catch (error) {
            console.error("Sync failed", error);
            return { success: false, error: error.message };
        }
    }
}
