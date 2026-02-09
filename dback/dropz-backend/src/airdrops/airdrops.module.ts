import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AirdropsService } from './airdrops.service';
import { AirdropsController } from './airdrops.controller';
import { Airdrop, AirdropSchema } from './schemas/airdrop.schema';
import { AirdropParticipant, AirdropParticipantSchema } from './schemas/airdrop-participant.schema';

import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Airdrop.name, schema: AirdropSchema },
      { name: AirdropParticipant.name, schema: AirdropParticipantSchema },
    ]),
    TransactionsModule,
  ],
  providers: [AirdropsService],
  controllers: [AirdropsController],
  exports: [AirdropsService],
})
export class AirdropsModule { }
