import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

interface Task {
    id: string;
    title: string;
    description: string;
    type: 'twitter_follow' | 'twitter_retweet' | 'twitter_like' | 'twitter_comment' | 'discord' | 'custom';
    url?: string;
    rewardAmount: string; // Amount earned per task (in wei, e.g., "0.3" tokens)
}

@Schema()
export class Airdrop extends Document {
    @Prop({ required: true })
    owner: string; // Wallet address of airdrop creator

    @Prop({ required: true })
    name: string; // Name of the airdrop

    @Prop({ required: true })
    tokenAddress: string; // ERC-20 token contract address

    @Prop({ required: true })
    totalAmount: string; // Total amount to distribute (in wei)

    @Prop({ type: [Object], default: [] })
    tasks: Task[]; // List of tasks users can complete

    @Prop({ default: '300000000000000000' }) // 0.3 tokens in wei
    taskRewardAmount: string; // Amount earned per task completion

    @Prop({ default: '100000000000000000' }) // 0.1 tokens in wei
    checkinRewardAmount: string; // Amount earned per daily check-in

    @Prop({ default: 'pending' })
    status: string; // pending, active, completed, cancelled

    @Prop({ default: '0' })
    totalDistributed: string; // Total amount distributed so far

    @Prop({ default: 0 })
    participantsCount: number; // Total unique participants

    @Prop({ default: 0 })
    totalTasksCompleted: number; // Total task completions across all users

    @Prop({ default: 0 })
    totalCheckinsCompleted: number; // Total check-ins across all users

    @Prop({ type: [String], default: [] })
    participants: string[]; // List of user wallets participating

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ required: false })
    expiresAt: Date; // Optional expiration date

    @Prop({ type: Object, required: false })
    metadata: Record<string, any>; // Extra metadata (description, logo, etc.)
}

export const AirdropSchema = SchemaFactory.createForClass(Airdrop);
