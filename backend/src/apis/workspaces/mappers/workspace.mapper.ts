import { Workspace } from '@prisma/client';
import { WorkspaceResponseDto } from '../dto/workspace-response.dto';
import { WorkspaceMemberResponseDto } from '../dto/workspace-member-response.dto';

export function workspaceMapper(
    workspace: Workspace & {
        members?: any[]
        repositories?: any[]
    },
): WorkspaceResponseDto {
    return {
        id: workspace.id,
        name: workspace.name,
        description: workspace.description ?? undefined,
        createdAt: workspace.createdAt,
        memberCount: workspace.members?.length ?? 0,
        repositoryCount: workspace.repositories?.length ?? 0,
    }
}

export function workspaceMemberMapper(
    member: any,
): WorkspaceMemberResponseDto {
    return {
        id: member.id,
        username: member.user.email,
        avatarUrl: member.user.avatarUrl,
        role: member.role,
        joinedAt: member.joinedAt,
    }
}