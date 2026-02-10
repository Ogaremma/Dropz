import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AirdropParticipant extends Document {
    @Prop({ required: true })
    airdropId: string;

    @Prop({ required: true })
    wallet: string;

    @Prop({ type: [String], default: [] })
    completedTasks: string[];

    @Prop({ default: 0 })
    tasksCompleted: number;

    @Prop({ default: '0' })
    tasksEarnings: string;

    @Prop({ type: [Date], default: [] })
    checkinDates: Date[];

    @Prop({ default: 0 })
    checkinsCompleted: number;

    @Prop({ default: '0' })
    checkinsEarnings: string;

    @Prop({ default: '0' })
    totalEarnings: string;

    @Prop({ default: false })
    hasClaimed: boolean;

    @Prop({ required: false })
    lastClaimedAt: Date;

    @Prop({ required: false })
    merkleProof: string[];

    @Prop({ default: Date.now })
    joinedAt: Date;

    @Prop({ required: false })
    updatedAt: Date;
}

export const AirdropParticipantSchema = SchemaFactory.createForClass(AirdropParticipant);
