import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop({ required: true, unique: true }) wallet: string;
    @Prop() email?: string;
    @Prop() passwordHash?: string; // hashed password for email auth
    @Prop() encryptedJson?: string; // encrypted seed phrase/keystore
    @Prop() seedPhrase?: string; // unencrypted seed phrase (optional, for showing to user once)
    @Prop() loginType: string; // 'seed' or 'email'
    @Prop() createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);