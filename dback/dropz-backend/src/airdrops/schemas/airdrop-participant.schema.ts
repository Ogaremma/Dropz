import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AirdropParticipant extends Document {
    @Prop({ required: true })
    airdropId: string; // Reference to airdrop

    @Prop({ required: true })
    wallet: string; // User wallet address

    @Prop({ type: [String], default: [] })
    completedTasks: string[]; // List of completed task IDs

    @Prop({ default: 0 })
    tasksCompleted: number; // Number of tasks completed

    @Prop({ default: '0' })
    tasksEarnings: string; // Amount earned from tasks (in wei)

    @Prop({ type: [Date], default: [] })
    checkinDates: Date[]; // Dates of check-ins

    @Prop({ default: 0 })
    checkinsCompleted: number; // Number of daily check-ins completed

    @Prop({ default: '0' })
    checkinsEarnings: string; // Amount earned from check-ins (in wei)

    @Prop({ default: '0' })
    totalEarnings: string; // Total earnings: tasks + check-ins

    @Prop({ default: false })
    hasClaimed: boolean; // Whether user has claimed all earnings

    @Prop({ required: false })
    lastClaimedAt: Date; // When they last claimed

    @Prop({ required: false })
    merkleProof: string[]; // Merkle proof for this user (for on-chain verification)

    @Prop({ default: Date.now })
    joinedAt: Date;

    @Prop({ required: false })
    updatedAt: Date;
}

export const AirdropParticipantSchema = SchemaFactory.createForClass(AirdropParticipant);
