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
        if (!rpcUrl) return;

        try {
            const response = await fetch(rpcUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: 1,
                    method: "alchemy_getAssetTransfers",
                    params: [
                        {
                            fromBlock: "0x0",
                            toAddress: wallet,
                            category: ["external"],
                            order: "desc"
                        }
                    ]
                })
            });

            const data = await response.json();
            const transfers = data.result?.transfers || [];

            for (const transfer of transfers) {
                // Alchemy returns asset name, if null/empty it's usually ETH for external
                if (transfer.asset === 'ETH' || !transfer.asset) {
                    const existing = await this.transactionModel.findOne({ transactionHash: transfer.hash });
                    if (!existing) {
                        await this.create({
                            wallet: wallet.toLowerCase(),
                            type: 'DEPOSIT',
                            amount: transfer.value.toString(),
                            transactionHash: transfer.hash,
                            status: 'CONFIRMED',
                            tokenName: 'ETH'
                        });
                    }
                }
            }
            return { success: true, count: transfers.length };
        } catch (error) {
            console.error("Sync failed", error);
            return { success: false, error: error.message };
        }
    }
}
