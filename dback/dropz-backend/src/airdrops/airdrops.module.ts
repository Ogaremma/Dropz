import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AirdropsService } from './airdrops.service';
import { AirdropsController } from './airdrops.controller';
import { Airdrop, AirdropSchema } from './schemas/airdrop.schema';
import { AirdropParticipant, AirdropParticipantSchema } from './schemas/airdrop-participant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Airdrop.name, schema: AirdropSchema },
      { name: AirdropParticipant.name, schema: AirdropParticipantSchema },
    ]),
  ],
  providers: [AirdropsService],
  controllers: [AirdropsController],
})
export class AirdropsModule { }
