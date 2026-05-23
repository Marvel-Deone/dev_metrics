import { ApiProperty } from '@nestjs/swagger';

import { WorkspaceRole } from '@prisma/client';

export class WorkspaceMemberResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  username!: string

  @ApiProperty()
  avatarUrl?: string

  @ApiProperty({
    enum: WorkspaceRole,
  })
  role!: WorkspaceRole

  @ApiProperty()
  joinedAt!: Date
}