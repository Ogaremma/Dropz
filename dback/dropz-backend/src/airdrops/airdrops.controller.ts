import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AirdropsService } from './airdrops.service';

@Controller('airdrops')
export class AirdropsController {
    constructor(private readonly airdropsService: AirdropsService) { }

    // === AIRDROP MANAGEMENT ===

    // User creates a new airdrop campaign
    @Post('create')
    async create(@Body() createAirdropDto: any) {
        return this.airdropsService.create(createAirdropDto);
    }

    // Get all airdrops
    @Get()
    async findAll() {
        return this.airdropsService.findAll();
    }

    // Get airdrop by ID
    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.airdropsService.findById(id);
    }

    // Get airdrops by owner (campaigns created by a user)
    @Get('owner/:owner')
    async findByOwner(@Param('owner') owner: string) {
        return this.airdropsService.findByOwner(owner);
    }

    // Update airdrop status (active, completed, cancelled)
    @Post(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: string,
    ) {
        return this.airdropsService.updateStatus(id, status);
    }

    // === USER PARTICIPATION ===

    // User joins an airdrop campaign by connecting wallet
    @Post(':id/join')
    async joinAirdrop(
        @Param('id') id: string,
        @Body('wallet') wallet: string,
    ) {
        return this.airdropsService.joinAirdrop(id, wallet);
    }

    // Get current user's participation info and earnings
    @Get(':id/participant/:wallet')
    async getParticipant(
        @Param('id') id: string,
        @Param('wallet') wallet: string,
    ) {
        return this.airdropsService.getParticipant(id, wallet);
    }

    // Get all participants for an airdrop
    @Get(':id/participants')
    async getParticipants(@Param('id') id: string) {
        return this.airdropsService.getParticipants(id);
    }

    // === TASKS & EARNINGS ===

    // User completes a task (follow, retweet, like, comment) and earns 0.3 tokens
    @Post(':id/complete-task')
    async completeTask(
        @Param('id') id: string,
        @Body() body: { wallet: string; taskId: string },
    ) {
        return this.airdropsService.completeTask(id, body.wallet, body.taskId);
    }

    // User does daily check-in and earns 0.1 tokens
    @Post(':id/checkin')
    async dailyCheckin(
        @Param('id') id: string,
        @Body('wallet') wallet: string,
    ) {
        return this.airdropsService.dailyCheckin(id, wallet);
    }

    // Get claimable amount for a user (total earnings)
    @Get(':id/claimable/:wallet')
    async getClaimableAmount(
        @Param('id') id: string,
        @Param('wallet') wallet: string,
    ) {
        return this.airdropsService.getClaimableAmount(id, wallet);
    }

    // === CLAIMING ===

    // User claims their earned tokens immediately
    @Post(':id/claim')
    async claimEarnings(
        @Param('id') id: string,
        @Body() body: { wallet: string; merkleProof: string[] },
    ) {
        return this.airdropsService.claimEarnings(id, body.wallet, body.merkleProof);
    }
}
