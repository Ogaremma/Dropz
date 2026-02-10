import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

interface Task {
    id: string;
    title: string;
    description: string;
    type: 'twitter_follow' | 'twitter_retweet' | 'twitter_like' | 'twitter_comment' | 'discord' | 'custom';
    url?: string;
    rewardAmount: string;
}

@Schema()
export class Airdrop extends Document {
    @Prop({ required: true })
    owner: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    tokenAddress: string;

    @Prop({ required: true })
    totalAmount: string;

    @Prop({ type: [Object], default: [] })
    tasks: Task[];

    @Prop({ default: '300000000000000000' })
    taskRewardAmount: string;

    @Prop({ default: '100000000000000000' })
    checkinRewardAmount: string;

    @Prop({ default: 'pending' })
    status: string;

    @Prop({ default: '0' })
    totalDistributed: string;

    @Prop({ default: 0 })
    participantsCount: number;

    @Prop({ default: 0 })
    totalTasksCompleted: number;

    @Prop({ default: 0 })
    totalCheckinsCompleted: number;

    @Prop({ type: [String], default: [] })
    participants: string[];

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ required: false })
    expiresAt: Date;

    @Prop({ type: Object, required: false })
    metadata: Record<string, any>;
}

export const AirdropSchema = SchemaFactory.createForClass(Airdrop);
