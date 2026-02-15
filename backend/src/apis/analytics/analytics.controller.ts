import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @UseGuards(JwtAuthGuard)
    @Get('overview')
    async getOverview(@Req() req: any) {
        return this.analyticsService.getOverview(req.user);
    }
}
