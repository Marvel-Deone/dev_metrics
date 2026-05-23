import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { WorkspaceRole } from '@prisma/client';

import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

import { workspaceMapper } from './mappers/workspace.mapper';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class WorkspacesService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    // create workspace
    async createWorkspace(
        userId: string,
        dto: CreateWorkspaceDto,
    ) {
        const workspace = await this.prisma.workspace.create({
            data: {
                name: dto.name,
                description: dto.description,

                members: {
                    create: {
                        userId,
                        role: WorkspaceRole.ADMIN,
                    },
                },
                ownerId: userId,
            },

            include: {
                members: true,
                repositories: true,
            },
        })

        return workspaceMapper(workspace);
    }

    // get user workspace
    async getMyWorkspaces(userId: string) {
        const workspaces =
            await this.prisma.workspace.findMany({
                where: {
                    members: {
                        some: {
                            userId,
                        },
                    },
                },

                include: {
                    members: true,
                    repositories: true,
                },

                orderBy: {
                    createdAt: 'desc',
                },
            })

        return workspaces.map(workspaceMapper);
    }

    // get single workspace     
    async getWorkspaceById(
        workspaceId: string,
        userId: string,
    ) {
        const workspace =
            await this.prisma.workspace.findFirst({
                where: {
                    id: workspaceId,

                    members: {
                        some: {
                            userId,
                        },
                    },
                },

                include: {
                    members: true,
                    repositories: true,
                },
            })

        if (!workspace) {
            throw new NotFoundException(
                'Workspace not found',
            );
        }

        return workspaceMapper(workspace);
    }

    // update workspace
    async updateWorkspace(
        workspaceId: string,
        userId: string,
        dto: UpdateWorkspaceDto,
    ) {
        const membership =
            await this.prisma.workspaceMember.findFirst({
                where: {
                    workspaceId,
                    userId,
                },
            })

        if (!membership) {
            throw new ForbiddenException(
                'Access denied',
            )
        }

        if (membership.role !== WorkspaceRole.ADMIN) {
            throw new ForbiddenException(
                'Admin access required',
            )
        }

        const workspace =
            await this.prisma.workspace.update({
                where: {
                    id: workspaceId,
                },

                data: {
                    ...dto,
                },

                include: {
                    members: true,
                    repositories: true,
                },
            })

        return workspaceMapper(workspace)
    }

    // delete workspace
    async deleteWorkspace(
        workspaceId: string,
        userId: string,
    ) {
        const membership =
            await this.prisma.workspaceMember.findFirst({
                where: {
                    workspaceId,
                    userId,
                },
            })

        if (!membership) {
            throw new ForbiddenException(
                'Access denied',
            )
        }

        if (membership.role !== WorkspaceRole.ADMIN) {
            throw new ForbiddenException(
                'Admin access required',
            )
        }

        await this.prisma.workspace.delete({
            where: {
                id: workspaceId,
            },
        })

        return {
            success: true,
        }
    }
}