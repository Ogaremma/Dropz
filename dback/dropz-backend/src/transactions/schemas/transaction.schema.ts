import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
    @Prop({ required: true })
    wallet: string;

    @Prop({ required: true, enum: ['SEND', 'CLAIM', 'CREATE', 'DEPOSIT'] })
    type: string;

    @Prop({ required: true })
    amount: string;

    @Prop()
    recipient?: string;

    @Prop()
    tokenName?: string;

    @Prop()
    transactionHash?: string;

    @Prop({ default: 'success' })
    status: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
