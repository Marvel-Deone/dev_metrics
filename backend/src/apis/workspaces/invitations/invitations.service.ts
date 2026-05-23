import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { WorkspaceRole, InvitationStatus } from '@prisma/client';

import { randomBytes } from 'crypto';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { workspaceMemberMapper } from '../mappers/workspace.mapper';
import { InviteMemberDto } from '../dto/invite-member.dto';
import { MailService } from 'src/apis/mail/mail.service';
import { invitationTemplate } from 'src/apis/mail/templates/invitation.template';

@Injectable()
export class InvitationsService {
    constructor(
        private prisma: PrismaService,
        private mailService: MailService,
    ) { }

    private generateToken() {
        return randomBytes(32).toString('hex');
    }

    async inviteMember(
        workspaceId: string,
        invitedById: string,
        dto: InviteMemberDto
    ) {
        const workspace = await this.prisma.workspace.findUnique({
            where: { id: workspaceId },
        });

        if (!workspace) {
            throw new NotFoundException('Workspace not found');
        }

        // Check inviter is admin
        const membership = await this.prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId: invitedById,
            },
        });

        if (!membership || membership.role !== WorkspaceRole.ADMIN) {
            throw new ForbiddenException('Only admins can invite members');
        }

        // Existing pending invitation?
        const existingInvitation =
            await this.prisma.workspaceInvitation.findFirst({
                where: {
                    workspaceId,
                    email: dto.email,
                    status: InvitationStatus.PENDING,
                },
            });

        if (existingInvitation) {
            throw new BadRequestException(
                'User already has a pending invitation',
            );
        }

        const token = this.generateToken();

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const invitation =
            await this.prisma.workspaceInvitation.create({
                data: {
                    email: dto.email,
                    token,
                    workspaceId,
                    invitedById,
                    role: dto.role,
                    expiresAt,
                },
            });

        // Email Sending
        const inviter = await this.prisma.user.findUnique({
            where: {
                id: invitedById,
            },
        });

        const acceptUrl = `${process.env.FRONTEND_URL}/invitations/${token}`;

        await this.mailService.sendMail({
            to: dto.email,
            subject: `Invitation to join ${workspace.name}`,
            html: invitationTemplate(
                workspace.name,
                inviter?.username || 'A DevMetrics user',
                acceptUrl,
            ),
        });

        return workspaceMemberMapper(invitation);
    }

    async resendInvitation(invitationId: string, userId: string) {
        const invitation =
            await this.prisma.workspaceInvitation.findUnique({
                where: { id: invitationId },
                include: {
                    workspace: true,
                },
            });

        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }

        const membership = await this.prisma.workspaceMember.findFirst({
            where: {
                workspaceId: invitation.workspaceId,
                userId,
            },
        });

        if (!membership || membership.role !== WorkspaceRole.ADMIN) {
            throw new ForbiddenException('Only admins can resend invitations');
        }

        const token = this.generateToken();

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const updated =
            await this.prisma.workspaceInvitation.update({
                where: { id: invitationId },
                data: {
                    token,
                    expiresAt,
                    status: InvitationStatus.PENDING,
                },
            });

        // Email sending
        const inviter = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        const acceptUrl = `${process.env.FRONTEND_URL}/invitations/${token}`;

        await this.mailService.sendMail({
            to: invitation.email,
            subject: `Invitation to join ${invitation.workspace.name}`,
            html: invitationTemplate(
                invitation.workspace.name,
                inviter?.username || 'A DevMetrics user',
                acceptUrl,
            ),
        });

        return workspaceMemberMapper(updated);
    }

    async acceptInvitation(token: string, userId: string) {
        const invitation =
            await this.prisma.workspaceInvitation.findUnique({
                where: { token },
            });

        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            throw new BadRequestException('Invitation already processed');
        }

        if (invitation.expiresAt < new Date()) {
            await this.prisma.workspaceInvitation.update({
                where: { id: invitation.id },
                data: {
                    status: InvitationStatus.EXPIRED,
                },
            });

            throw new BadRequestException('Invitation expired');
        }

        // Prevent duplicate membership
        const existingMembership =
            await this.prisma.workspaceMember.findFirst({
                where: {
                    workspaceId: invitation.workspaceId,
                    userId,
                },
            });

        if (existingMembership) {
            throw new BadRequestException(
                'User already belongs to workspace',
            );
        }

        await this.prisma.workspaceMember.create({
            data: {
                workspaceId: invitation.workspaceId,
                userId,
                role: invitation.role,
            },
        });

        await this.prisma.workspaceInvitation.update({
            where: { id: invitation.id },
            data: {
                status: InvitationStatus.ACCEPTED,
                acceptedAt: new Date(),
                userId,
            },
        });

        return {
            message: 'Invitation accepted successfully',
        };
    }

    async rejectInvitation(token: string) {
        const invitation =
            await this.prisma.workspaceInvitation.findUnique({
                where: { token },
            });

        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            throw new BadRequestException('Invitation already processed');
        }

        await this.prisma.workspaceInvitation.update({
            where: { id: invitation.id },
            data: {
                status: InvitationStatus.REJECTED,
            },
        });

        return {
            message: 'Invitation rejected',
        };
    }
}