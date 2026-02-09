import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop({ required: true, unique: true }) wallet: string;
    @Prop() email?: string;
    @Prop() passwordHash?: string;
    @Prop() encryptedJson?: string;
    @Prop() seedPhrase?: string;
    @Prop() loginType: string;

    // Profile Fields
    @Prop() username?: string;
    @Prop() bio?: string;
    @Prop() avatarUrl?: string;

    @Prop() createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);