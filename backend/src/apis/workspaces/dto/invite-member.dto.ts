import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { WorkspaceRole } from '@prisma/client';

export class InviteMemberDto {
  @ApiProperty({
    example: 'john@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    enum: WorkspaceRole,
    required: false,
    default: WorkspaceRole.MEMBER,
  })
  @IsOptional()
  @IsEnum(WorkspaceRole)
  role?: WorkspaceRole = WorkspaceRole.MEMBER;
}