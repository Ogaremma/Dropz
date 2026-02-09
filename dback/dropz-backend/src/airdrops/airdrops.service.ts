import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Airdrop } from './schemas/airdrop.schema';
import { AirdropParticipant } from './schemas/airdrop-participant.schema';

interface Task {
    id: string;
    title: string;
    description: string;
    type: string;
    url?: string;
    rewardAmount: string;
}

interface CreateAirdropDto {
    owner: string;
    name: string;
    tokenAddress: string;
    totalAmount: string;
    tasks?: Task[];
    taskRewardAmount?: string; // Default: 0.3 tokens
    checkinRewardAmount?: string; // Default: 0.1 tokens
    metadata?: Record<string, any>;
    expiresAt?: Date;
}

import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class AirdropsService {
    constructor(
        @InjectModel(Airdrop.name) private airdropModel: Model<Airdrop>,
        @InjectModel(AirdropParticipant.name) private participantModel: Model<AirdropParticipant>,
        private transactionsService: TransactionsService,
    ) { }

    // Search airdrops by name
    async search(query: string) {
        return this.airdropModel.find({
            name: { $regex: query, $options: 'i' }
        }).exec();
    }

    // Create a new airdrop campaign
    async create(createAirdropDto: CreateAirdropDto) {
        const airdrop = new this.airdropModel({
            ...createAirdropDto,
            status: 'active', // Airdrop is active immediately
            totalDistributed: '0',
            participantsCount: 0,
            participants: [],
            // Use provided amounts or defaults
            taskRewardAmount: createAirdropDto.taskRewardAmount || '300000000000000000', // 0.3 tokens
            checkinRewardAmount: createAirdropDto.checkinRewardAmount || '100000000000000000', // 0.1 tokens
        });
        const savedAirdrop = await airdrop.save();

        // Log transaction
        await this.transactionsService.create({
            wallet: createAirdropDto.owner,
            type: 'CREATE',
            amount: createAirdropDto.totalAmount,
            tokenName: createAirdropDto.name,
            status: 'success'
        });

        return savedAirdrop;
    }

    // Get all airdrops
    async findAll() {
        return this.airdropModel.find().exec();
    }

    // Get airdrops by owner
    async findByOwner(owner: string) {
        return this.airdropModel.find({ owner }).exec();
    }

    // Get airdrop by ID
    async findById(id: string) {
        return this.airdropModel.findById(id).exec();
    }

    // User joins airdrop by connecting wallet
    async joinAirdrop(airdropId: string, wallet: string) {
        const airdrop = await this.airdropModel.findById(airdropId);
        if (!airdrop) {
            throw new BadRequestException('Airdrop not found');
        }

        // Check if already participant
        const existing = await this.participantModel.findOne({ airdropId, wallet });
        if (existing) {
            return existing;
        }

        // Add to participants list
        await this.airdropModel.findByIdAndUpdate(
            airdropId,
            {
                $push: { participants: wallet },
                $inc: { participantsCount: 1 },
            },
        ).exec();

        // Create participant record
        const participant = new this.participantModel({
            airdropId,
            wallet,
            completedTasks: [],
            tasksCompleted: 0,
            tasksEarnings: '0',
            checkinDates: [],
            checkinsCompleted: 0,
            checkinsEarnings: '0',
            totalEarnings: '0',
            hasClaimed: false,
        });
        return participant.save();
    }

    // User completes a task and earns tokens
    async completeTask(airdropId: string, wallet: string, taskId: string) {
        const airdrop = await this.airdropModel.findById(airdropId);
        if (!airdrop) {
            throw new BadRequestException('Airdrop not found');
        }

        const participant = await this.participantModel.findOne({ airdropId, wallet });
        if (!participant) {
            throw new BadRequestException('Participant not found. Join airdrop first.');
        }

        if (participant.completedTasks.includes(taskId)) {
            throw new BadRequestException('Task already completed');
        }

        // Add task to completed list
        participant.completedTasks.push(taskId);
        participant.tasksCompleted = participant.completedTasks.length;

        // Add reward
        const newEarnings = (BigInt(participant.tasksEarnings) + BigInt(airdrop.taskRewardAmount)).toString();
        participant.tasksEarnings = newEarnings;
        participant.totalEarnings = (BigInt(newEarnings) + BigInt(participant.checkinsEarnings)).toString();
        participant.updatedAt = new Date();

        // Update airdrop stats
        await this.airdropModel.findByIdAndUpdate(
            airdropId,
            { $inc: { totalTasksCompleted: 1 } },
        ).exec();

        return participant.save();
    }

    // User does daily check-in and earns tokens
    async dailyCheckin(airdropId: string, wallet: string) {
        const airdrop = await this.airdropModel.findById(airdropId);
        if (!airdrop) {
            throw new BadRequestException('Airdrop not found');
        }

        const participant = await this.participantModel.findOne({ airdropId, wallet });
        if (!participant) {
            throw new BadRequestException('Participant not found. Join airdrop first.');
        }

        // Check if already checked in today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const checkedInToday = participant.checkinDates.some(date => {
            const checkDate = new Date(date);
            checkDate.setHours(0, 0, 0, 0);
            return checkDate.getTime() === today.getTime();
        });

        if (checkedInToday) {
            throw new BadRequestException('Already checked in today');
        }

        // Add check-in
        participant.checkinDates.push(new Date());
        participant.checkinsCompleted = participant.checkinDates.length;

        // Add reward
        const newEarnings = (BigInt(participant.checkinsEarnings) + BigInt(airdrop.checkinRewardAmount)).toString();
        participant.checkinsEarnings = newEarnings;
        participant.totalEarnings = (BigInt(newEarnings) + BigInt(participant.tasksEarnings)).toString();
        participant.updatedAt = new Date();

        // Update airdrop stats
        await this.airdropModel.findByIdAndUpdate(
            airdropId,
            { $inc: { totalCheckinsCompleted: 1 } },
        ).exec();

        return participant.save();
    }

    // Get participant earnings
    async getParticipant(airdropId: string, wallet: string) {
        return this.participantModel.findOne({ airdropId, wallet }).exec();
    }

    // Get all participants for an airdrop
    async getParticipants(airdropId: string) {
        return this.participantModel.find({ airdropId }).exec();
    }

    // Claim all earnings immediately
    async claimEarnings(airdropId: string, wallet: string, merkleProof: string[]) {
        const airdrop = await this.airdropModel.findById(airdropId);
        if (!airdrop) {
            throw new BadRequestException('Airdrop not found');
        }

        const participant = await this.participantModel.findOne({ airdropId, wallet });
        if (!participant) {
            throw new BadRequestException('Participant not found');
        }

        if (participant.hasClaimed) {
            throw new BadRequestException('Already claimed all earnings');
        }

        const claimAmount = participant.totalEarnings;
        if (claimAmount === '0') {
            throw new BadRequestException('No earnings to claim');
        }

        // Check if airdrop has enough balance
        const remainingBalance = (BigInt(airdrop.totalAmount) - BigInt(airdrop.totalDistributed)).toString();
        if (BigInt(claimAmount) > BigInt(remainingBalance)) {
            throw new BadRequestException('Insufficient airdrop balance');
        }

        // Update participant
        participant.hasClaimed = true;
        participant.lastClaimedAt = new Date();
        participant.merkleProof = merkleProof;

        // Update airdrop
        const newTotalDistributed = (BigInt(airdrop.totalDistributed) + BigInt(claimAmount)).toString();
        await this.airdropModel.findByIdAndUpdate(
            airdropId,
            { totalDistributed: newTotalDistributed },
        ).exec();

        const savedParticipant = await participant.save();

        // Log transaction
        await this.transactionsService.create({
            wallet: wallet,
            type: 'CLAIM',
            amount: claimAmount,
            tokenName: airdrop.name,
            status: 'success'
        });

        return savedParticipant;
    }

    // Get claimable amount for a user
    async getClaimableAmount(airdropId: string, wallet: string) {
        const participant = await this.participantModel.findOne({ airdropId, wallet });
        if (!participant) {
            return { claimableAmount: '0', breakdown: { tasks: '0', checkins: '0' } };
        }

        return {
            claimableAmount: participant.totalEarnings,
            breakdown: {
                tasks: participant.tasksEarnings,
                checkins: participant.checkinsEarnings,
            },
            hasClaimed: participant.hasClaimed,
        };
    }

    // Update airdrop status
    async updateStatus(id: string, status: string) {
        return this.airdropModel.findByIdAndUpdate(
            id,
            { status },
            { new: true },
        ).exec();
    }
}
