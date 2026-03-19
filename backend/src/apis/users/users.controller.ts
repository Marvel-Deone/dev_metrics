import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CompleteOnboardingDto } from './dtos/onboarding.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
    path: 'users',
    version: '1',
})
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiOperation({ summary: 'Get authenticated user profile & metrics' })
    async getProfile(@CurrentUser() user: { userId: string }) {
        return this.usersService.getProfile(user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('onboarding')
    async completeOnboarding(
        @Req() req,
        @Body() dto: CompleteOnboardingDto,
    ) {
        console.log('HIddd:');
        
        return this.usersService.completeOnboarding(
            req.user.userId,
            dto.goal,
        );
    }
}
