import {
    Body,
    Controller,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import { InvitationsService } from './invitations.service';
import { JwtAuthGuard } from 'src/apis/auth/jwt-auth.guard';
import { InviteMemberDto } from '../dto/invite-member.dto';
import { success } from 'src/common/functions/response..util';

@ApiTags('Workspace Invitations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class InvitationsController {
    constructor(
        private readonly invitationsService: InvitationsService,
    ) { }

    @Post(':workspaceId/invitations')
    @ApiOperation({
        summary: 'Invite member to workspace',
    })
    async inviteMember(
        @Param('workspaceId') workspaceId: string,
        @Body() dto: InviteMemberDto,
        @CurrentUser() user: any,
    ) {
        const invitation = await this.invitationsService.inviteMember(
            workspaceId,
            user.userId,
            dto
        );

        return success(
            invitation,
            'Invitation sent successfully',
        );
    }

    @Patch('invitations/:token/accept')
    @ApiOperation({
        summary: 'Accept workspace invitation',
    })
    async acceptInvitation(
        @Param('token') token: string,
        @CurrentUser() user: any,
    ) {
        const invitation = await this.invitationsService.acceptInvitation(
            token,
            user.userId,
        );

        return success(
            invitation,
            'Invitation accepted successfully',
        );
    }

    @Patch(
        'invitations/:invitationId/resend',
    )
    @ApiOperation({
        summary: 'Resend invitation',
    })
    async resendInvitation(
        @Param('invitationId')
        @CurrentUser() user: any,
        invitationId: string,
    ) {
        const invitation = await this.invitationsService.resendInvitation(invitationId, user.userId);

        return success(
            invitation,
            'Invitation resent successfully',
        );
    }
}