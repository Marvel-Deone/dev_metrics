import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkspaceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  memberCount!: number;

  @ApiProperty()
  repositoryCount!: number;
}